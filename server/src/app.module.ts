import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { SignalingModule } from './signaling/signaling.module';
import { MediasoupService } from './mediasoup/mediasoup.service';
import { MediasoupGateway } from './mediasoup/mediasoup.gateway';
import { OktoApiModule } from './okto-api/okto-api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonsService } from './persons/persons.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://lokeshnagasaid:vz8bsAYmp2q5hg5r@undefined/?replicaSet=atlas-pyn6b1-shard-0&ssl=true&authSource=admin', {

    }),
    ChatModule, SignalingModule, OktoApiModule],
  controllers: [AppController],
  providers: [AppService, MediasoupService, MediasoupGateway, PersonsService],
})
export class AppModule { }


