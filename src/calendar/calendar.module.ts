import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { PrismaService } from '../shared/services/prisma.service';

@Module({
  imports: [
  ],
  providers: [
    CalendarService,
    PrismaService,
  ],
  controllers: [
    CalendarController
  ],
  exports: [
    CalendarService
  ]
})
export class CalendarModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}
