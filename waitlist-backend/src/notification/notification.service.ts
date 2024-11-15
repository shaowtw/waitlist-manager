import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { Waitlist } from '../schemas/waitlist.schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private io: Server;

  setSocketServer(io: Server) {
    this.io = io;
    console.log("noticiation socket : ", this.io === undefined);
    this.logger.log('Socket.IO server initialized');
  }

  sendNotification(partyId: string, partyName: string, type: boolean, message: string): void {
    if (this.io) {
      this.io.emit('notification', { partyId, partyName, type, message });
      console.log(`Notification sent to Party ID ${partyId}: ${message}`);
    } else {
      this.logger.error('Socket.IO server not initialized');
    }
  }

  sendWaitList(data: Waitlist[]): void {
    if (this.io) {
      this.io.emit('waitlist', { data });
      console.log(`Notification sent to Party ID ${data}`);
    } else {
      this.logger.error('Socket.IO server not initialized');
    }
  }

  sendCheckInList(data: Waitlist[]): void {
    if (this.io) {
      this.io.emit('checkinList', { data });
      console.log(`Notification sent to Party ID ${data}`);
    } else {
      this.logger.error('Socket.IO server not initialized');
    }
  }
}