import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { Waitlist } from '../schemas/waitlist.schema';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post('add')
  async addToWaitlist(@Body('name') name: string, @Body('partySize') partySize: number): Promise<Waitlist> {
    return this.waitlistService.addToWaitlist(name, partySize);
  }

  @Get('getWaitList')
  async getWaitlist(): Promise<Waitlist[]> {
    return this.waitlistService.getWaitlist();
  }

  @Get('getCheckInList')
  async getCheckInList(): Promise<Waitlist[]> {
    return this.waitlistService.getCheckInList();
  }

  @Put('check-in/:id')
  async checkIn(@Param('id') id: string): Promise<Waitlist> {
    return this.waitlistService.checkIn(id);
  }
  @Delete(':id')
  async leaveWaitlist(@Param('id') id: string): Promise<void> {
    return this.waitlistService.leaveWaitlist(id);
  }
}
