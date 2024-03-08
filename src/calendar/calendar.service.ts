import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import * as dayjs from 'dayjs';
import type { Calendar, CalendarUpdateParams } from './interface'
import type { CalendarQueryDto } from '../calendar/dto/index.dto'

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

  async updateCount(params?: Partial<CalendarUpdateParams>): Promise<Calendar> {
    let { date, count } = params || {};

    // 获取当前的 count 值
    const currentCalendar = await this.prisma.calendar.findUnique({
      where: {
        date: dayjs(date).format('YYYY-MM-DD'),
      },
    });

    const updateCount = currentCalendar ? Number(currentCalendar.count + count) : +count;
    if (isNaN(updateCount)) {
      throw new HttpException('Count must be a number', HttpStatus.BAD_REQUEST);
    }
    if (updateCount < 0) {
      throw new HttpException('Count cannot be less than 0', HttpStatus.BAD_REQUEST);
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

  async getCountSum(query?: CalendarQueryDto): Promise<number> {
    const { start_date, end_date } = query || {};
    const data = await this.prisma.calendar.findMany({
      where: {
        date: {
          gte: start_date || dayjs().format('YYYY-MM-DD'),
          lte: end_date || dayjs().format('YYYY-MM-DD'),
        },
      },
    });
    return data.reduce((sum, item) => sum + item.count, 0);
  }
}
