import { Module } from '@nestjs/common';
import { Huddle01roomService } from './huddle01room.service';
import { Huddle01roomController } from './huddle01room.controller';
import { OktoApiService } from 'src/okto-api/okto-api.service';
import { PersonService } from 'src/persons/persons.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema, GameHistory, GameHistorySchema } from 'src/persons/schemas/person.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    MongooseModule.forFeature([{ name: GameHistory.name, schema: GameHistorySchema }])
  ],
  providers: [Huddle01roomService, OktoApiService, PersonService],
  controllers: [Huddle01roomController]
})
export class Huddle01roomModule { }
