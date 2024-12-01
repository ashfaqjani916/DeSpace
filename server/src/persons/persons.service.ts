import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person } from './schemas/person.schema';
import { GameHistory } from './schemas/person.schema';
import { CreatePersonDto } from './schemas/create-person.dto';
import { UpdatePersonDto } from './schemas/update-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person.name) private personModel: Model<Person>,
    @InjectModel(GameHistory.name) private gameHistoryModel: Model<GameHistory>,
  ) { }

  // Create a new person
  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const createdPerson = new this.personModel(createPersonDto);
    return createdPerson.save();
  }

  async getAll() {
    const users = await this.personModel.find({});
    return users;
  }

  // Get all persons
  async findAll(): Promise<Person[]> {
    return this.personModel.find().exec();
  }

  // Get a person by ID
  async findOne(personId: number): Promise<Person | null> {
    return this.personModel.findOne({ person_id: personId }).exec();
  }

  // Update person details
  async update(personId: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    return this.personModel.findOneAndUpdate(
      { person_id: personId },
      updatePersonDto,
      { new: true },
    ).exec();
  }

  // Delete a person by ID
  async remove(personId: number): Promise<any> {
    return this.personModel.deleteOne({ person_id: personId }).exec();
  }

  // Add a game history to a person
  async addGameHistory(personId: number, result: string): Promise<Person> {
    const person = await this.findOne(personId);
    if (!person) {
      throw new Error('Person not found');
    }
    const gameHistory = new this.gameHistoryModel({ result });
    person.game_history.push(gameHistory);
    return person.save();
  }

  // Get a person's game history
  async getGameHistory(personId: number): Promise<GameHistory[]> {
    const person = await this.findOne(personId);
    if (!person) {
      throw new Error('Person not found');
    }
    return person.game_history;
  }

  // Add a meeting ID to the person
  async addMeetingId(personId: number, meetingId: number): Promise<Person> {
    const person = await this.findOne(personId);
    if (!person) {
      throw new Error('Person not found');
    }
    person.meeting_ids.push(meetingId);
    return person.save();
  }
}
