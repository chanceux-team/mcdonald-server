import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainModule } from './main/main.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MainModule,
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule { }
