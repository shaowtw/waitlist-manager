import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotificationService } from './notification/notification.service';
import { WaitlistService } from './waitlist/waitlist.service';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const server = app.getHttpServer();
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Get & set the Socket.IO server
  const notificationService = app.get(NotificationService);
  notificationService.setSocketServer(io);

  const waitlistService = app.get(WaitlistService);
  waitlistService.setSocketServer(io);

  await app.listen(process.env.PORT ?? 3001);
  console.log('Application is running on http://localhost:3001');
}
bootstrap();
