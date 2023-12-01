import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import AppModule from './nest/modules/app.module';
import AllExceptionsFilter from './@core/common/infra/exception-filter';
import LoggerFactory from './@core/common/infra/logger-factory';
import NestLoggerAdapter from './@core/common/infra/logger-nest-adapter';

async function bootstrap() {
  const logger = LoggerFactory.getInstance();
  const loggerAdapter = new NestLoggerAdapter(logger);

  const app = await NestFactory.create(AppModule, {
    logger: loggerAdapter,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  await app.listen(3000);
}

bootstrap();
