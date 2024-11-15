import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Waitlist } from '../schemas/waitlist.schema';
import { NotificationService } from '../notification/notification.service';
import { Server } from 'socket.io';

@Injectable()
export class WaitlistService {
  private readonly maxSeats = 10;
  private readonly serviceTimePerPerson = 3 * 1000; // 3 seconds
  private waitQueue : string[] = [];
  private checkInQueue : string[] = [];

  constructor(
    @InjectModel(Waitlist.name) private waitlistModel: Model<Waitlist>,
    private notificationService: NotificationService
  ) {
    this.initializeQueue();
  }
  
  private async initializeQueue(): Promise<void> {
    const waitlistEntries = await this.waitlistModel.find({ status: 'waiting' }).exec();
    this.waitQueue = waitlistEntries.map(entry => entry._id.toString());
    setInterval(() => this.notifyStatusForFirstTwo(), 20 * 1000);
  }

  setSocketServer(io: Server) {
    this.notificationService.setSocketServer(io);
  }

  async addToWaitlist(name: string, partySize: number): Promise<Waitlist> {  
    if (partySize > this.maxSeats) {
      throw new BadRequestException('Not enough available seats for this party size.');
    }
    const newParty = new this.waitlistModel({ name, partySize });
    await newParty.save();
    this.waitQueue.push(newParty._id.toString());
    const _waitList : Waitlist[] = await this.getWaitlist();;
    this.notificationService.sendWaitList(_waitList);
    return newParty;
  }

  async getWaitlist(): Promise<Waitlist[]> {
    const waitlistPromises = this.waitQueue.map(id => this.waitlistModel.findOne({ _id: id }).exec());
    const waitlist: Waitlist[] = await Promise.all(waitlistPromises);
    return waitlist;
  }

  private async findPartyById(id: string): Promise<Waitlist | null> {
    return this.waitlistModel.findById(id).exec();
  }

  async checkIn(id: string): Promise<Waitlist> {
    const party = await this.findPartyById(id);
    if (!party) {
      throw new BadRequestException('Party not found.');
    }
  
    // Check if there are enough seats available
    let currentCheckInSize = 0;
    for (const partyId of this.checkInQueue) {
      const checkInParty = await this.waitlistModel.findById(partyId);
      if (checkInParty) {
        currentCheckInSize += checkInParty.partySize;
      }
    }
  
    if (currentCheckInSize + party.partySize > this.maxSeats) {
      this.notificationService.sendNotification(id, party.name, false, 'There is no enough seat, please wait for a while.');
      throw new BadRequestException('Not enough available seats for this party size.');
    }
  
    // Move party from waitQueue to checkInQueue
    const index = this.waitQueue.indexOf(id);
    if (index > -1) {
      this.waitQueue.splice(index, 1);
      this.checkInQueue.push(id);
    }
  
    party.status = 'served';
    await party.save();

    // Notify the party that they have been served
    this.notificationService.sendNotification(id, party.name, true, 'You have been served. Please proceed to your table.');
    const _checkinList : Waitlist[] = await this.getCheckInList();;
    this.notificationService.sendCheckInList(_checkinList);
    
    const _waitList : Waitlist[] = await this.getWaitlist();;
    this.notificationService.sendWaitList(_waitList);
    
    setTimeout(() => {
      this.completeService(id);
    }, party.partySize * this.serviceTimePerPerson);
  
    return party;
  }

  async getCheckInList(): Promise<Waitlist[]> {
    const checkInPromises = this.checkInQueue.map(id => this.waitlistModel.findOne({ _id: id }).exec());
    const checkInList: Waitlist[] = await Promise.all(checkInPromises);
    return checkInList;
  }

  async leaveWaitlist(id: string): Promise<void> {
    const party = await this.findPartyById(id);
    if (!party) {
      throw new NotFoundException('Party not found.');
    }

    const index = this.waitQueue.indexOf(id);
    if (index > -1) {
        this.waitQueue.splice(index, 1);
    }

    if (party.status !== 'served') {
        await this.waitlistModel.findByIdAndDelete(id);
        this.notificationService.sendNotification(id, party.name, true, 'You have been removed from the waitlist.');
        const _waitlist : Waitlist[] = await this.getWaitlist();
        this.notificationService.sendWaitList(_waitlist);
    }
  }
  
  async getStatus(id: string): Promise<number> {
    return this.waitQueue.indexOf(id);
  }

  private async completeService(id: string): Promise<void> {
    const party = await this.waitlistModel.findById(id);
    if (party) {
      party.status = 'completed';
      await party.save();
    }
    const index = this.checkInQueue.indexOf(id);
    if (index > -1) {
        this.checkInQueue.splice(index, 1);
        this.notificationService.sendNotification(id, party.name, true, 'Your service is completed!');
        const _checkinList = await this.getCheckInList();
        this.notificationService.sendCheckInList(_checkinList);
    }
  }

  private notifyStatusForFirstTwo(): void {
    if (this.waitQueue.length > 0) {
        this.notifyStatus(this.waitQueue[0]);
    }
    if (this.waitQueue.length > 1) {
        this.notifyStatus(this.waitQueue[1]);
    }
  }

  private async notifyStatus(id: string): Promise<void> {
    const party : Waitlist = await this.findPartyById(id);
    const position = await this.getStatus(id);
    if (position === 1) {
      this.notificationService.sendNotification(id, party.name, true, 'You are second in line. Get ready!');
    } else if (position === 0) {
      this.notificationService.sendNotification(id, party.name, true, 'It is your turn! You can now check in.');
      this.scheduleLateNotification(id);
    }
  }

  private scheduleLateNotification(id: string): void {
    setTimeout(async () => {
      const party = await this.waitlistModel.findById(id);
      if (party && party.status === 'waiting') {
        this.notificationService.sendNotification(id, party.name, false, 'You are late to check in. Please proceed now.');

        setTimeout(async () => {
          const recheckParty = await this.waitlistModel.findById(id);
          if (recheckParty && recheckParty.status === 'waiting') {
            this.notificationService.sendNotification(id, recheckParty.name, false, 'You have been removed due to inactivity.');
            await this.removePartyFromWaitlist(id);
            this.notifyStatusForFirstTwo();
          }
        }, 10 * 1000); // 10 seconds after the first notification
      }
    }, 10 * 1000); // Initial 10 seconds delay
  }

  private async removePartyFromWaitlist(id: string): Promise<void> {
    const index = this.waitQueue.indexOf(id);
    if (index > -1) {
      this.waitQueue.splice(index, 1);
      await this.waitlistModel.findByIdAndDelete(id);
      const _checkinList: Waitlist[] = await this.getCheckInList();
      this.notificationService.sendCheckInList(_checkinList);

      const _waitList: Waitlist[] = await this.getWaitlist();
      this.notificationService.sendWaitList(_waitList);
    }
  }
}