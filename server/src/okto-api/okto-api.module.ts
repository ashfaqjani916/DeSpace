import { Module } from '@nestjs/common';
import { OktoApiService } from './okto-api.service';
import { OktoApiController } from './okto-api.controller';

@Module({
  providers: [OktoApiService],
  controllers: [OktoApiController]
})
export class OktoApiModule { }
