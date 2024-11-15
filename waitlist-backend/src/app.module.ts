import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WaitlistModule } from './waitlist/waitlist.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb://127.0.0.1:27017/waitlist',
      }),
    }),
    WaitlistModule,
    NotificationModule,
  ],
})
export class AppModule {}
