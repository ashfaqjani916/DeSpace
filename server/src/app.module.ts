import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { SignalingModule } from './signaling/signaling.module';
import { MediasoupService } from './mediasoup/mediasoup.service';
import { MediasoupGateway } from './mediasoup/mediasoup.gateway';
import { OktoApiModule } from './okto-api/okto-api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonService } from './persons/persons.service';
import { PersonModule } from './persons/persons.module';
import { Huddle01roomModule } from './huddle01room/huddle01room.module';
import { Huddle01roomService } from './huddle01room/huddle01room.service';
import { Huddle01roomController } from './huddle01room/huddle01room.controller';
import { OktoApiController } from './okto-api/okto-api.controller';
import { OktoApiService } from './okto-api/okto-api.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://rishidha04:CUqLIc34NGNqvr5i@cluster0.8edre.mongodb.net/', {

    }),
    ChatModule, SignalingModule, OktoApiModule, PersonModule, Huddle01roomModule, ScheduleModule.forRoot()],
  controllers: [AppController, Huddle01roomController, OktoApiController],
  providers: [AppService, MediasoupService, MediasoupGateway, PersonService, Huddle01roomService, OktoApiService],
})
export class AppModule { }


