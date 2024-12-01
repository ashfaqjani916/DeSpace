import { Module } from '@nestjs/common';
import { OktoApiService } from './okto-api.service';
import { OktoApiController } from './okto-api.controller';
import { PersonService } from 'src/persons/persons.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema, GameHistory, GameHistorySchema } from 'src/persons/schemas/person.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    MongooseModule.forFeature([{ name: GameHistory.name, schema: GameHistorySchema }])
  ],
  providers: [OktoApiService, PersonService],
  controllers: [OktoApiController]
})
export class OktoApiModule { }
