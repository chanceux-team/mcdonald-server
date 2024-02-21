import { Module } from '@nestjs/common';
import { AppController } from './bot.controller';
import { AppService } from './bot.service';
import { PrismaService } from '../shared/services/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService],
})
export class BotModule { }
