import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder, type SwaggerDocumentOptions } from '@nestjs/swagger';

async function bootstrap() {
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
}
bootstrap();
