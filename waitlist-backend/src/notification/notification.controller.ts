import { Controller, Param, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post(':partyId')
  sendNotification(@Param('partyId') partyId: string, partyName: string, @Body('type') type: boolean, @Body('message') message: string): void {
    this.notificationService.sendNotification(partyId, partyName, type, message);
  }
}