import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { CalendarModule } from '../calendar/calendar.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CalendarModule,
  ],
  controllers: [BotController],
  providers: [
    BotService,
  ],
})
export class BotModule {}
