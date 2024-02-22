import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

const calendarData: Prisma.CalendarCreateInput[] = [];
for (let i = 0; i < 366; i++) {
  calendarData.push({
    date: dayjs(dayjs().subtract(1, 'year')).add(i, 'day').format('YYYY-MM-DD'),
  });
}

async function main() {
  // eslint-disable-next-line no-console
  console.log('Start seeding ...');
  for (const item of calendarData) {
    await prisma.calendar.create({
      data: item,
    });
  }
  // eslint-disable-next-line no-console
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
