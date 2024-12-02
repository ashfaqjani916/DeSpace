import { Test, TestingModule } from '@nestjs/testing';
import { Huddle01roomService } from './huddle01room.service';

describe('Huddle01roomService', () => {
  let service: Huddle01roomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Huddle01roomService],
    }).compile();

    service = module.get<Huddle01roomService>(Huddle01roomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
