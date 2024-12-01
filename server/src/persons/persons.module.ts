<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
  ],
  exports: [MongooseModule], // Export MongooseModule to make it available to other modules
})
export class PersonModule { }
=======
// persons.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonService } from './persons.service';
import { Person, PersonSchema, Meeting, MeetingSchema, PersonList, PersonListSchema } from './model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Person.name, schema: PersonSchema },
      { name: Meeting.name, schema: MeetingSchema },
      { name: PersonList.name, schema: PersonListSchema },
    ]),
  ],
  providers: [PersonService],
  exports: [PersonService], // Export the service to make it available to other modules
})
export class PersonsModule {}
>>>>>>> abdf584 (resolved errors related to mongoose)
