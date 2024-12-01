import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// GameHistory Schema for a person's game results
@Schema()
export class GameHistory {
  @Prop({ required: true })
  result: string;
}

// Person Schema including meeting and game history
@Schema()
export class Person extends Document {
  @Prop({ required: true })
  person_id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  attendance_count: number;

  @Prop({ type: [Number], default: [] })
  meeting_ids: number[];

  @Prop({ type: [GameHistory], default: [] })
  game_history: GameHistory[];

  @Prop({ required: true })
  address: string;
}

export const GameHistorySchema = SchemaFactory.createForClass(GameHistory);
export const PersonSchema = SchemaFactory.createForClass(Person);
