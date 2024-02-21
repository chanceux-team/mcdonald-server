import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import WebSocket from 'ws';
import puppeteer from 'puppeteer';
import { FormData } from "formdata-node"
import { Blob } from 'buffer';

@Injectable()
export class AppService {
  ws = null;
  constructor(private prisma: PrismaService) {
    this.connect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async capture() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://test.lazegull.top');
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
    this.ws = new WebSocket('wss://mattermost.lazegull.top/api/v4/websocket');

    this.ws.on('close', () => {
      setTimeout(this.connect, 1000);
    });

    this.ws.on('open', () => {
      function sendAuthentication() {
        const authData = {
          seq: 1,
          action: 'authentication_challenge',
          data: {
            token: 'epdg3sntctbturypgj63jz5zmh',
          },
        };
        this.ws.send(JSON.stringify(authData));
      }
      sendAuthentication();
    });

    this.ws.on('message', async (res) => {
      const data = JSON.parse(res);
      if (data.event === 'posted') {
        const post = JSON.parse(data.data.post);
        if (post.message.startsWith('@mcdonalds')) {
          if (post.message.includes('+1')) {
            await fetch('https://test.lazegull.top/api/calendar/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ count: 1 }),
            });
          }
          if (post.message.includes('-1')) {
            await fetch('https://test.lazegull.top/api/calendar/update', {
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
            `https://mattermost.lazegull.top/api/v4/files?channel_id=${post.channel_id}&filename=${fileName}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer epdg3sntctbturypgj63jz5zmh`,
              },
              body: body,
            },
          );
          const file = await response.json();
          fetch('https://mattermost.lazegull.top/api/v4/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer epdg3sntctbturypgj63jz5zmh`,
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
