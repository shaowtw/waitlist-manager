import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Waitlist, WaitlistSchema } from '../schemas/waitlist.schema';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Waitlist.name, schema: WaitlistSchema }]),
    NotificationModule
  ],
  providers: [WaitlistService, NotificationService],
  controllers: [WaitlistController],
})
export class WaitlistModule {}
