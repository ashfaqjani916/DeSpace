import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema, GameHistory, GameHistorySchema } from './schemas/person.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    MongooseModule.forFeature([{ name: GameHistory.name, schema: GameHistorySchema }])
  ],
  exports: [MongooseModule],
})
export class PersonModule { }
