import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot/bot.module';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder, type SwaggerDocumentOptions } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const microService = await NestFactory.createMicroservice<MicroserviceOptions>(BotModule);

  const app = await NestFactory.create(ApplicationModule, {
    rawBody: true,
    cors: true,
    bodyParser: true,
  });

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
      methodKey: string,
    ) => methodKey
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  await microService.listen();
}
bootstrap();
