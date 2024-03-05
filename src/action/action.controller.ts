import { Controller, Get } from '@nestjs/common';
import { ActionService } from './action.service'

@Controller('action')
export class ActionController {
  constructor(private server:ActionService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.server.getHello()
  }
}
