import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { SignalingModule } from './signaling/signaling.module';
import { MediasoupService } from './mediasoup/mediasoup.service';
import { MediasoupGateway } from './mediasoup/mediasoup.gateway';
import { OktoApiModule } from './okto-api/okto-api.module';

@Module({
  imports: [ChatModule, SignalingModule, OktoApiModule],
  controllers: [AppController],
  providers: [AppService, MediasoupService, MediasoupGateway],
})
export class AppModule { }


