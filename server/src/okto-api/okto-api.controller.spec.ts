import { Test, TestingModule } from '@nestjs/testing';
import { OktoApiController } from './okto-api.controller';

describe('OktoApiController', () => {
  let controller: OktoApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OktoApiController],
    }).compile();

    controller = module.get<OktoApiController>(OktoApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
