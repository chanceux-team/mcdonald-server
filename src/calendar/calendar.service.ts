import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) { }

  async get(): Promise<any> {
    const data = await this.prisma.calendar.findMany({
      take: 365,
      orderBy: {
        id: 'desc',
      },
    });
    return data;
  }

  async getDateOrCreate({ count, date }: { count?: number; date?: string }) {
    if (!date) {
      date = dayjs().format('YYYY-MM-DD');
    }
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    let calendarEntry = await this.prisma.calendar.findFirst({
      where: {
        date: formattedDate,
      },
    });

    if (!calendarEntry) {
      calendarEntry = await this.prisma.calendar.create({
        data: {
          date: formattedDate,
          count: count || 1,
        },
      });
    }

    return calendarEntry;
  }

  async updateCount({ id, count, date, operation }: { id?: number; count?: number; date?: string; operation?: 'increment' | 'decrement' }) {
    let result = null;
    operation = operation || 'increment';
    if (id) {
      result = await this.prisma.calendar.update({
        data: {
          count: {
            [operation]: count || 1,
          },
        },
        where: {
          id,
        },
      });
    } else {
      const updateDate = await this.getDateOrCreate({ count, date });
      result = await this.prisma.calendar.update({
        data: {
          count: {
            [operation]: count || 1,
          },
        },
        where: {
          date: updateDate.date,
          ...(operation === 'decrement' && { count: { gte: count } }),
        },
      });
    }
    return result;
  }

  async increment(data: { id?: number; count?: number }) {
    return this.updateCount({ ...data, operation: 'increment' });
  }

  async decrement(data: { id?: number; count?: number }) {
    data.count = data.count && Math.abs(data.count);
    return this.updateCount({ ...data, operation: 'decrement' });
  }
}
