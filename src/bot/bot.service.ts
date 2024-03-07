import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';
import puppeteer from 'puppeteer';
import { FormData } from "formdata-node"
import { Blob } from 'buffer';
import { CalendarService } from '../calendar/calendar.service'
import type { CalendarQueryDto } from '../calendar/dto/index.dto'
import * as dayjs from 'dayjs';

@Injectable()
export class BotService {
  private ws: WebSocket | null = null;

  constructor(private readonly calendarService: CalendarService) {
    this.connect();
  }

  async capture() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(process.env.FRONTEND_URL);
    await page.waitForSelector('.heatmap');
    const element = await page.$('.heatmap');
    if (element) {
      const data = await element.screenshot();
      await browser.close();
      return { file: data };
    } else {
      return { message: 'Element not found' };
    }
  }

  /**
   * 获取日期段的打开次数
   */
  async getCountSum(query: CalendarQueryDto): Promise<number> {
    return await this.calendarService.getCountSum(query);
  }

  async post(post: any, action?: string) {
    const { file: buffer } = await this.capture();
    const body = new FormData();
    const fileName = `${new Date().toISOString().replace(/:/g, '-')}.png`;
    body.append('files', new Blob([buffer]), fileName);
    const response = await fetch(
      `https://${process.env.MM_DOMAIN}/api/v4/files?channel_id=${post.channel_id}&filename=${fileName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.BOT_TOKEN}`,
        },
        body: body,
      },
    );

    const file = await response.json();

    const [todayCount, weekCount, monthCount] = await Promise.all([
      this.getCountSum({
        start_date: dayjs().format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      }),
      this.getCountSum({
        start_date: dayjs().startOf('week').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      }),
      this.getCountSum({
        start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
      }),
    ])

    const message = `已为你成功${action}！`;
    const analytics = `今天累计打卡${todayCount}次，本周累计打卡${weekCount}次， 本月累计打卡${monthCount}次`;
    fetch(`https://${process.env.MM_DOMAIN}/api/v4/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel_id: post.channel_id,
        // root_id: post.id,
        message: '## 麦当劳打卡统计\n' + (action ? message : '') + '\n' + analytics,
        file_ids: file.file_infos.map((f) => f.id),
      }),
    });
  }

  /**
   * 从消息中提取操作数字
   * @param message 消息
   */
  extract(message: string): { operation: '+' | '-'; count: number } {
    const match = message.match(/@mcdonalds (\S)(\d+)/);
    if (match) {
      const operation = match[1] as '+' | '-';
      const count = Number(match[2]);
      return { operation, count };
    }
    return null;
  }

  // 初始化 WebSocket 连接
  connect() {
    this.ws = new WebSocket(`wss://${process.env.MM_DOMAIN}/api/v4/websocket`);
    this.ws.on('close', () => {
      setTimeout(this.connect, 1000);
    });

    this.ws.on('open', () => {
      const authData = {
        seq: 1,
        action: 'authentication_challenge',
        data: {
          token: process.env.BOT_TOKEN,
        },
      };
      this.ws.send(JSON.stringify(authData));
    });

    this.ws.on('message', async (res) => {
      const data = JSON.parse(res as unknown as string);
      if (data.event !== 'posted') return;
      const post = JSON.parse(data.data.post);
      if (!post.message || !post.message.startsWith('@mcdonalds')) return

      const { count, operation } = this.extract(post.message) || {};

      if (count && operation) {
        await this.calendarService.updateCount({ count: Number(`${operation}${count}`) })
        this.post(post, `${operation}${count}`)
        return
      }
      this.post(post)
    });
  }
}

