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
<<<<<<< HEAD
import { PersonModule } from './persons/persons.module';
=======
import { PersonsModule } from './persons/persons.module';
>>>>>>> abdf584 (resolved errors related to mongoose)

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://rishidha04:CUqLIc34NGNqvr5i@cluster0.8edre.mongodb.net/', {

    }),
<<<<<<< HEAD
    ChatModule, SignalingModule, OktoApiModule, PersonModule],
=======
    ChatModule, SignalingModule, OktoApiModule, PersonsModule],
>>>>>>> abdf584 (resolved errors related to mongoose)
  controllers: [AppController],
  providers: [AppService, MediasoupService, MediasoupGateway, PersonService],
})
export class AppModule { }


