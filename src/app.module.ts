import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalendarModule } from './calendar/calendar.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CalendarModule,
    BotModule,
  ],
  controllers: [],
  providers: []
})
export class ApplicationModule { }
