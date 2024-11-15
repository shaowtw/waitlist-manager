import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';
import { Waitlist } from '../schemas/waitlist.schema';

describe('WaitlistController', () => {
  let waitlistController: WaitlistController;
  let waitlistService: WaitlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitlistController],
      providers: [
        {
          provide: WaitlistService,
          useValue: {
            addToWaitlist: jest.fn(),
            getWaitlist: jest.fn(),
            getCheckInList: jest.fn(),
            checkIn: jest.fn(),
            leaveWaitlist: jest.fn(),
          },
        },
      ],
    }).compile();

    waitlistController = module.get<WaitlistController>(WaitlistController);
    waitlistService = module.get<WaitlistService>(WaitlistService);
  });

  it('should be defined', () => {
    expect(waitlistController).toBeDefined();
  });

  describe('addToWaitlist', () => {
    it('should call waitlistService.addToWaitlist with correct parameters', async () => {
      const name = 'AAA';
      const partySize = 4;
      const result = {
        name : 'AAA',
        partySize : 4,
        status : 'waiting',
        createdAt : new Date()
      }
      jest.spyOn(waitlistService, 'addToWaitlist').mockResolvedValue(result as Waitlist);

      expect(await waitlistController.addToWaitlist(name, partySize)).toBe(result);
      expect(waitlistService.addToWaitlist).toHaveBeenCalledWith(name, partySize);
    });
  });

  describe('getWaitlist', () => {
    it('should return an array of waitlist', async () => {
      const result = [
        {
          name : 'AAA',
          partySize : 4,
          status : 'waiting',
          createdAt : new Date()
        },
        {
          name : 'BBB',
          partySize : 2,
          status : 'waiting',
          createdAt : new Date()
        }
      ];
      jest.spyOn(waitlistService, 'getWaitlist').mockResolvedValue(result as Waitlist[]);

      expect(await waitlistController.getWaitlist()).toBe(result);
    });
  });

  describe('getCheckInList', () => {
    it('should return an array of check-in list', async () => {
      const result = [
        {
          name : 'AAA',
          partySize : 4,
          status : 'waiting',
          createdAt : new Date()
        },
        {
          name : 'BBB',
          partySize : 2,
          status : 'waiting',
          createdAt : new Date()
        }
      ];
      jest.spyOn(waitlistService, 'getCheckInList').mockResolvedValue(result as Waitlist[]);

      expect(await waitlistController.getCheckInList()).toBe(result);
    });
  });

  describe('checkIn', () => {
    it('should call waitlistService.checkIn with correct id', async () => {
      const id = '123';
      const result =
        {
          name : 'BBB',
          partySize : 2,
          status : 'waiting',
          createdAt : new Date()
        }
      jest.spyOn(waitlistService, 'checkIn').mockResolvedValue(result as Waitlist);

      expect(await waitlistController.checkIn(id)).toBe(result);
      expect(waitlistService.checkIn).toHaveBeenCalledWith(id);
    });
  });

  describe('leaveWaitlist', () => {
    it('should call waitlistService.leaveWaitlist with correct id', async () => {
      const id = '123';
      jest.spyOn(waitlistService, 'leaveWaitlist').mockResolvedValue();

      await waitlistController.leaveWaitlist(id);
      expect(waitlistService.leaveWaitlist).toHaveBeenCalledWith(id);
    });
  });
  describe('addToWaitlist', () => {
    it('should call waitlistService.addToWaitlist with correct parameters', async () => {
      const name = 'John Doe';
      const partySize = 4;
      const result = 
        {
          name : 'AAA',
          partySize : 4,
          status : 'waiting',
          createdAt : new Date()
        }
      jest.spyOn(waitlistService, 'addToWaitlist').mockResolvedValue(result as Waitlist);

      expect(await waitlistController.addToWaitlist( name, partySize )).toBe(result);
      expect(waitlistService.addToWaitlist).toHaveBeenCalledWith(name, partySize);
    });
  });

  describe('getWaitlist', () => {
    it('should return an array of waitlist', async () => {
      const result = [
        {
          name : 'AAA',
          partySize : 4,
          status : 'waiting',
          createdAt : new Date()
        },
        {
          name : 'BBB',
          partySize : 2,
          status : 'waiting',
          createdAt : new Date()
        }
      ];
      jest.spyOn(waitlistService, 'getWaitlist').mockResolvedValue(result as Waitlist[]);

      expect(await waitlistController.getWaitlist()).toBe(result);
    });
  });

  describe('getCheckInList', () => {
    it('should return an array of check-in list', async () => {
      const result = [
        {
          name : 'AAA',
          partySize : 4,
          status : 'waiting',
          createdAt : new Date()
        },
        {
          name : 'BBB',
          partySize : 2,
          status : 'waiting',
          createdAt : new Date()
        }
      ];
      jest.spyOn(waitlistService, 'getCheckInList').mockResolvedValue(result as Waitlist[]);

      expect(await waitlistController.getCheckInList()).toBe(result);
    });
  });

  describe('checkIn', () => {
    it('should call waitlistService.checkIn with correct id', async () => {
      const id = '123';
      const result = {
          name : 'AAA',
          partySize : 4,
          status : 'waiting',
          createdAt : new Date()
        }
      jest.spyOn(waitlistService, 'checkIn').mockResolvedValue(result as Waitlist);

      expect(await waitlistController.checkIn(id)).toBe(result);
      expect(waitlistService.checkIn).toHaveBeenCalledWith(id);
    });
  });

  describe('leaveWaitlist', () => {
    it('should call waitlistService.leaveWaitlist with correct id', async () => {
      const id = '123';
      jest.spyOn(waitlistService, 'leaveWaitlist').mockResolvedValue();

      await waitlistController.leaveWaitlist(id);
      expect(waitlistService.leaveWaitlist).toHaveBeenCalledWith(id);
    });
  });
});