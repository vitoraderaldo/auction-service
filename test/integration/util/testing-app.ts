import { Mongoose } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import AppModule from '../../../src/app.module';
import AllExceptionsFilter from '../../../src/@core/common/infra/exception-filter';
import LoggerFactory from '../../../src/@core/common/infra/logger-factory';

export const startTestingApp = async (): Promise<INestApplication> => {
  const logger = LoggerFactory.getInstance();
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  return app;
};

export const getMongoConnection = (app: INestApplication): Mongoose => (
  app.get<Mongoose>('MONGOOSE_CONNECTION')
);
