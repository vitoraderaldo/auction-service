import { Mongoose } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import AppModule from '../../../src/nest/modules/app.module';
import AllExceptionsFilter from '../../../src/@core/common/infra/api/nest/exception-filter';
import { ErrorLogger } from '../../../src/@core/common/infra/api/nest/error-parser';

export const startTestingApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  const errorLogger = app.get(ErrorLogger);

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(errorLogger));

  return app;
};

export const getMongoConnection = (app: INestApplication): Mongoose => (
  app.get<Mongoose>('MONGOOSE_CONNECTION')
);
