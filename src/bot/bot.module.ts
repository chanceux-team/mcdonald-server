import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { PrismaService } from '../shared/services/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [BotController],
  providers: [
    BotService,
  ],
})
export class BotModule { }
