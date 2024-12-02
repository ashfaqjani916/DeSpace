import { Test, TestingModule } from '@nestjs/testing';
import { Huddle01roomController } from './huddle01room.controller';

describe('Huddle01roomController', () => {
  let controller: Huddle01roomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Huddle01roomController],
    }).compile();

    controller = module.get<Huddle01roomController>(Huddle01roomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
