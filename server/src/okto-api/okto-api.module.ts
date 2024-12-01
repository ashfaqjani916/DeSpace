import { Module } from '@nestjs/common';
import { OktoApiService } from './okto-api.service';
import { OktoApiController } from './okto-api.controller';
<<<<<<< HEAD
import { PersonService } from 'src/persons/persons.service';

@Module({
  providers: [OktoApiService, PersonService],
=======
import { PersonsModule } from 'src/persons/persons.module';

@Module({
  providers: [OktoApiService, PersonsModule],
>>>>>>> abdf584 (resolved errors related to mongoose)
  controllers: [OktoApiController]
})
export class OktoApiModule { }
