import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { Server } from 'socket.io';
import { Waitlist } from '../schemas/waitlist.schema';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockIo: Partial<Server>;

  beforeEach(async () => {
    mockIo = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    service.setSocketServer(mockIo as Server);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should emit a notification event', () => {
      const partyId = '123';
      const partyName = 'Test Party';
      const type = true;
      const message = 'Test Message';

      service.sendNotification(partyId, partyName, type, message);

      expect(mockIo.emit).toHaveBeenCalledWith('notification', { partyId, partyName, type, message });
    });

    it('should log an error if io is not initialized', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      service['io'] = undefined;

      service.sendNotification('123', 'Test Party', true, 'Test Message');

      expect(loggerSpy).toHaveBeenCalledWith('Socket.IO server not initialized');
    });
  });

  describe('sendWaitList', () => {
    it('should emit a waitlist event', () => {
      const data: Waitlist[] = [];

      service.sendWaitList(data);

      expect(mockIo.emit).toHaveBeenCalledWith('waitlist', { data });
    });

    it('should log an error if io is not initialized', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      service['io'] = undefined;

      service.sendWaitList([]);

      expect(loggerSpy).toHaveBeenCalledWith('Socket.IO server not initialized');
    });
  });

  describe('sendCheckInList', () => {
    it('should emit a checkinList event', () => {
      const data: Waitlist[] = [];

      service.sendCheckInList(data);

      expect(mockIo.emit).toHaveBeenCalledWith('checkinList', { data });
    });

    it('should log an error if io is not initialized', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      service['io'] = undefined;

      service.sendCheckInList([]);

      expect(loggerSpy).toHaveBeenCalledWith('Socket.IO server not initialized');
    });
  });
});