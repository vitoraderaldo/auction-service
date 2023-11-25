import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import AppModule from '../../../src/app.module';

describe('Health Controller (e2e)', () => {
  let app: INestApplication;
  let connection: Mongoose;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    connection = app.get<Mongoose>('MONGOOSE_CONNECTION');
    await app.init();
  });

  afterAll(async () => {
    await connection.disconnect();
    await app.close();
  });

  it('/ (GET)', () => request(app.getHttpServer()).get('/v1/health').expect(200).expect('OK'));
});
