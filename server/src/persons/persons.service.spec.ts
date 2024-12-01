import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './persons.service';

<<<<<<< HEAD
describe('PersonsService', () => {
=======
describe('PersonService', () => {
>>>>>>> abdf584 (resolved errors related to mongoose)
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonService],
    }).compile();

    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
