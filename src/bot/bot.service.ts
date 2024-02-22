import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';
import puppeteer from 'puppeteer';
import { FormData } from "formdata-node"
import { Blob } from 'buffer';

@Injectable()
export class BotService {
  private ws: WebSocket | null;

  constructor() {
    this.ws = null;
    this.connect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async capture() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(process.env.FRONTEND_URL);
    await page.screenshot();
    const element = await page.$('.heatmap');
    if (element) {
      const data = await element.screenshot();
      await browser.close();
      return { file: data };
    } else {
      return { message: 'Element not found' };
    }
  }

  // let ws;
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
      if (data.event === 'posted') {
        const post = JSON.parse(data.data.post);
        if (post.message.startsWith('@mcdonalds')) {
          if (post.message.includes('+1')) {
            await fetch(`https://${process.env.FRONTEND_URL}/api/calendar/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ count: 1 }),
            });
          }
          if (post.message.includes('-1')) {
            await fetch(`https://${process.env.FRONTEND_URL}/api/calendar/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ count: -1 }),
            });
          }
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
          fetch(`https://${process.env.MM_DOMAIN}/api/v4/posts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.BOT_TOKEN}`,
            },
            body: JSON.stringify({
              channel_id: post.channel_id,
              // root_id: post.id,
              file_ids: file.file_infos.map((f) => f.id),
            }),
          });
        }
      }
    });
  }
}
