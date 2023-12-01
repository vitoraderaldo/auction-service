import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import { getMongoConnection, startTestingApp } from '../util/testing-app';

describe('Health Controller (e2e)', () => {
  let app: INestApplication;
  let connection: Mongoose;

  beforeEach(async () => {
    app = await startTestingApp();

    connection = getMongoConnection(app);
    await app.init();
  });

  afterAll(async () => {
    await connection.disconnect();
    await app.close();
  });

  it('/ (GET)', () => request(app.getHttpServer()).get('/v1/health').expect(200).expect('OK'));
});
