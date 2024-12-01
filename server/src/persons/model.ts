import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// GameHistory Subdocument
@Schema()
export class GameHistory {
  @Prop({ required: true })
  result: string;
}

// Person Schema
@Schema()
export class Person {
  @Prop({ required: true, unique: true })
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

// Meeting Schema
@Schema()
export class Meeting {
  @Prop({ required: true, unique: true })
  meeting_id: number;

  @Prop({ required: true })
  creator_id: number;

  @Prop({ type: [Number], default: [] })
  attendees: number[];

  @Prop({ required: true })
  datetime: string;
}

// PersonList Schema
@Schema()
export class PersonList {
  @Prop({ type: [Person], default: [] })
  persons: Person[];

  @Prop({ type: [Meeting], default: [] })
  meetings: Meeting[];

  @Prop({ required: true })
  person_counter: number;

  @Prop({ required: true })
  meeting_counter: number;
}

export const GameHistorySchema = SchemaFactory.createForClass(GameHistory);
export const PersonSchema = SchemaFactory.createForClass(Person);
export const MeetingSchema = SchemaFactory.createForClass(Meeting);
export const PersonListSchema = SchemaFactory.createForClass(PersonList);
