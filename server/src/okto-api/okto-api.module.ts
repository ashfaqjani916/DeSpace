import { Module } from '@nestjs/common';
import { OktoApiService } from './okto-api.service';
import { OktoApiController } from './okto-api.controller';
import { PersonService } from 'src/persons/persons.service';

@Module({
  providers: [OktoApiService, PersonService],
  controllers: [OktoApiController]
})
export class OktoApiModule { }
