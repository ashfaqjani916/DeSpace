import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, Meeting, PersonList } from './model';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person.name) private personModel: Model<Person>,
    @InjectModel(Meeting.name) private meetingModel: Model<Meeting>,
    @InjectModel(PersonList.name) private personListModel: Model<PersonList>,
  ) { }

  async createPerson(personData: Partial<Person>): Promise<Person> {
    const newPerson = new this.personModel(personData);
    return newPerson.save();
  }

  async getPersonCount() {
    const persons = await this.personModel.find({});
    return persons.length;
  }

  async getAllPersons() {
    const persons = await this.personModel.find({});
    return persons;
  }

  async createMeeting(meetingData: Partial<Meeting>): Promise<Meeting> {
    const newMeeting = new this.meetingModel(meetingData);
    return newMeeting.save();
  }

  async getPersonById(personId: number): Promise<Person | null> {
    return this.personModel.findOne({ person_id: personId }).exec();
  }

  async getMeetingById(meetingId: number): Promise<Meeting | null> {
    return this.meetingModel.findOne({ meeting_id: meetingId }).exec();
  }

  async addMeetingToPerson(personId: number, meetingId: number): Promise<Person | null> {
    return this.personModel.findOneAndUpdate(
      { person_id: personId },
      { $push: { meeting_ids: meetingId } },
      { new: true },
    ).exec();
  }

  async addGameHistoryToPerson(personId: number, gameResult: string): Promise<Person | null> {
    return this.personModel.findOneAndUpdate(
      { person_id: personId },
      { $push: { game_history: { result: gameResult } } },
      { new: true },
    ).exec();
  }

  async listPersons(): Promise<Person[]> {
    return this.personModel.find().exec();
  }

  async listMeetings(): Promise<Meeting[]> {
    return this.meetingModel.find().exec();
  }
}
