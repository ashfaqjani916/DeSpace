import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  getHello(): string {
    console.log("Hello World");
    return 'Hello World!';
  }

  @Cron('*/13 * * * *')
  handleCron() {
    console.log('Cron job executed every 13 minutes');
  }
}
