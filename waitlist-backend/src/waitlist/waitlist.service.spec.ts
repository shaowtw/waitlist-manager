import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WaitlistService } from './waitlist.service';
import { NotificationService } from '../notification/notification.service';
import { Waitlist } from '../schemas/waitlist.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('WaitlistService', () => {
  let service: WaitlistService;
  let notificationService: NotificationService;
  let waitlistModel: Model<Waitlist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitlistService,
        {
          provide: getModelToken(Waitlist.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            sendNotification: jest.fn(),
            sendWaitList: jest.fn(),
            sendCheckInList: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WaitlistService>(WaitlistService);
    notificationService = module.get<NotificationService>(NotificationService);
    waitlistModel = module.get<Model<Waitlist>>(getModelToken(Waitlist.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToWaitlist', () => {
    it('should add a party to the waitlist', async () => {
      const newParty = { _id: '1', name: 'John Doe', partySize: 4 };
      jest.spyOn(waitlistModel, 'findOne').mockResolvedValue(newParty);

      const result = await service.addToWaitlist('John Doe', 4);

      expect(result).toEqual(newParty);
      expect(notificationService.sendWaitList).toHaveBeenCalled();
    });

    it('should throw an error if party size exceeds max seats', async () => {
      await expect(service.addToWaitlist('John Doe', 11)).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkIn', () => {
    it('should check in a party', async () => {
      const party = { _id: '1', name: 'John Doe', partySize: 4, status: 'waiting', save: jest.fn() };
      jest.spyOn(waitlistModel, 'findById').mockResolvedValue(party);

      const result = await service.checkIn('1');

      expect(result).toEqual(party);
      expect(notificationService.sendNotification).toHaveBeenCalledWith('1', 'John Doe', true, 'You have been served. Please proceed to your table.');
    });

    it('should throw an error if party is not found', async () => {
      jest.spyOn(waitlistModel, 'findById').mockResolvedValue(null);

      await expect(service.checkIn('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('leaveWaitlist', () => {
    it('should remove a party from the waitlist', async () => {
      const party = { _id: '1', name: 'John Doe', status: 'waiting' };
      jest.spyOn(waitlistModel, 'findById').mockResolvedValue(party);
      jest.spyOn(waitlistModel, 'findByIdAndDelete').mockResolvedValue(party);

      await service.leaveWaitlist('1');

      expect(notificationService.sendNotification).toHaveBeenCalledWith('1', 'John Doe', true, 'You have been removed from the waitlist.');
    });

    it('should throw an error if party is not found', async () => {
      jest.spyOn(waitlistModel, 'findById').mockResolvedValue(null);

      await expect(service.leaveWaitlist('1')).rejects.toThrow(NotFoundException);
    });
  });
});