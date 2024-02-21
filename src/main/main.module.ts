import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MainService } from './main.service';
import { MainController } from './main.controller';
import { PrismaService } from '../shared/services/prisma.service';
import { AppService } from '../bot/bot.service';

@Module({
  imports: [
  ],
  providers: [
    MainService,
    PrismaService,
    AppService
  ],
  controllers: [
    MainController
  ],
  exports: []
})
export class MainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}
