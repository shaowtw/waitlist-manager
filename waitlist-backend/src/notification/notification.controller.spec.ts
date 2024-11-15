import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            sendNotification: jest.fn(),
            initializeSocketServer: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationController = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should call sendNotification with correct parameters', () => {
    const partyId = '123';
    const partyName = 'PartyName';
    const type = true;
    const message = 'Test message';

    notificationController.sendNotification(partyId, partyName, type, message);

    expect(notificationService.sendNotification).toHaveBeenCalledWith(partyId, partyName, type, message);
  });
});