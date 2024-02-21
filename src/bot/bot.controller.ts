import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './bot.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  // @MessagePattern('gps')
  // async getHello(@Payload() data: string, @Ctx() context: MqttContext): Promise<string> {
  //   console.log(context.getTopic(), data);
  //   let res = await this.appService.sendRequest(data);
  //   return 'ok'
  // }
}
