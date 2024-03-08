import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import * as dayjs from 'dayjs';
import type { Calendar, CalendarUpdateParams } from './interface'

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) { }

  async get(): Promise<Calendar[]> {
    const data = await this.prisma.calendar.findMany({
      take: 365,
      orderBy: {
        id: 'desc',
      },
    });
    return data;
  }

  async updateCount(params?: Partial<Calendar>): Promise<Calendar> {
    let { date, count } = params || {};

    // 获取当前的 count 值
    const currentCalendar = await this.prisma.calendar.findUnique({
      where: {
        date: dayjs(date).format('YYYY-MM-DD'),
      },
    });

    // TODO: 返回400 状态码和错误信息给前端/mm
    const updateCount = currentCalendar ? Number(currentCalendar.count + count) : +count;
    if (isNaN(updateCount)) {
      throw new Error('Count must be a number');
    }
    if (currentCalendar && +updateCount < 0) {
      throw new Error('Count cannot be less than 0');
    }

    return await this.prisma.calendar.upsert({
      where: {
        date: dayjs(date).format('YYYY-MM-DD'),
      },
      update: {
        count: {
          increment: count,
        },
      },
      create: {
        date: dayjs(date).format('YYYY-MM-DD'),
        count,
      },
    });
  }
}
