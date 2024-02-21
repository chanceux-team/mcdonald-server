import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot/bot.module';
import { MainModule } from './main/main.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const microService = await NestFactory.createMicroservice<MicroserviceOptions>(BotModule);

  const app = await NestFactory.create(MainModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Backend')
    .setDescription('api')
    .setVersion('1.0')
    //.addServer('api')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
  await microService.listen();
}
bootstrap();

export interface SwaggerDocumentOptions {
  include?: Function[]; // 手动指定包含的模块
  extraModels?: Function[]; // 额外的model定义需和上面的关联,也就是存在include里面的
  ignoreGlobalPrefix?: boolean; // 这个设置为true,会忽略setGlobalPrefix的设置
  deepScanRoutes?: boolean; // 开启这个,只要是import的都会追加的索引的路由
  // 操作id,可以通过这个工厂函数来改变id的定义(接口请求生成)
  operationIdFactory?: (controllerKey: string, methodKey: string) => string;
}
