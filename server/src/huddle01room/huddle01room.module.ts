import { Module } from '@nestjs/common';
import { Huddle01roomService } from './huddle01room.service';
import { Huddle01roomController } from './huddle01room.controller';

@Module({
  providers: [Huddle01roomService],
  controllers: [Huddle01roomController]
})
export class Huddle01roomModule {}
