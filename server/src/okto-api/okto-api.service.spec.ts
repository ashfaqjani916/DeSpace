import { Test, TestingModule } from '@nestjs/testing';
import { OktoApiService } from './okto-api.service';

describe('OktoApiService', () => {
  let service: OktoApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OktoApiService],
    }).compile();

    service = module.get<OktoApiService>(OktoApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
