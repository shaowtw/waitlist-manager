import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Waitlist extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  partySize: number;

  @Prop({ default: 'waiting' })
  status: string; // 'waiting', 'ready', 'served'

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WaitlistSchema = SchemaFactory.createForClass(Waitlist);
