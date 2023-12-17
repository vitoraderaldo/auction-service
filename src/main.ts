import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import AppModule from './nest/modules/app.module';
import AllExceptionsFilter from './@core/common/infra/api/nest/exception-filter';
import LoggerFactory from './@core/common/infra/logger/logger-factory';
import NestLoggerAdapter from './@core/common/infra/logger/logger-nest-adapter';
import { ErrorLogger } from './@core/common/infra/api/nest/error-parser';

async function bootstrap() {
  const logger = LoggerFactory.getInstance();
  const loggerAdapter = new NestLoggerAdapter(logger);

  const app = await NestFactory.create(AppModule, {
    logger: loggerAdapter,
  });

  const errorLogger = app.get(ErrorLogger);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(errorLogger));
  await app.listen(3000);
}

bootstrap();
