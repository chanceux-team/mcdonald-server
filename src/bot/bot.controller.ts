import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { BotService } from './bot.service';

@Controller()
export class BotController {
  constructor(private readonly service: BotService) {
  }
}
