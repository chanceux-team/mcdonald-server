import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalendarModule } from './calendar/calendar.module';
import { BotModule } from './bot/bot.module';
import { ActionModule } from './action/action.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CalendarModule,
    BotModule,
    ActionModule,
  ],
  controllers: [],
  providers: []
})
export class ApplicationModule { }
