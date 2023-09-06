import {ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
//const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  app.use(cookieParser());
  //  before listening, pipe first!
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //allow extra but do not take it. only take whitelist body
    }),
  );
  app.enableCors({
	  origin : config.get<string>('CORS_ORIGIN'),
	  methods: config.get<string>('CORS_METHODS'),
	  allowedHeaders: config.get<string>('CORS_ALLOW_HEADERS'),
    credentials: true,
  })
  await app.listen(config.get<number>('CORS_PORT'));
}
bootstrap();
