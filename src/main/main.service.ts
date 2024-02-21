import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { AppService } from '../bot/bot.service';

@Injectable()
export class MainService {
  constructor(private prisma: PrismaService, private client: AppService) { }

  async getAllPackages(): Promise<any> {
    const res = await this.prisma.packages.findMany();
    //const tags = res.map((t: packages) => t);
    return { data: res }
  }

  async lock(lock_status: string): Promise<any> {
    this.client.client.publish('lock', lock_status.toString(), { QoS: 2 })
    if (lock_status == "1") {
      return {
        message: "开锁成功",
      }
    } else if (lock_status == "0") {
      return {
        message: "上锁成功",
      }
    }
  }
}
