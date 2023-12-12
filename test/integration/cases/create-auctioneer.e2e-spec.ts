import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import buildAuctioneer from '../../util/auctioneer.mock';
import AuctioneerSchema, { AuctioneerModel } from '../../../src/@core/auction/infra/database/schemas/auctioneer.schema';
import { getMongoConnection, startTestingApp } from '../util/testing-app';

describe('Create Auctioneer (e2e)', () => {
  let app: INestApplication;
  let connection: Mongoose;
  let auctioneerModel: AuctioneerModel;

  beforeAll(async () => {
    app = await startTestingApp();

    connection = getMongoConnection(app);
    auctioneerModel = AuctioneerSchema.getModel(connection);
    await app.init();
  });

  afterAll(async () => {
    await connection.disconnect();
    await app.close();
  });

  it('should create an auctioneer', async () => {
    const data = buildAuctioneer().toJSON();

    const input = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      registration: data.registration,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/auctioneer')
      .send(input)
      .expect(201);

    const savedAuctioneer = await auctioneerModel.findOne({ id: response.body.id });
    const auctioneer = response.body;

    expect(auctioneer.id).toBeTruthy();
    expect(auctioneer.firstName).toBe(input.firstName);
    expect(auctioneer.lastName).toBe(input.lastName);
    expect(auctioneer.email).toEqual(input.email);
    expect(auctioneer.registration).toBe(input.registration);
    expect(auctioneer.createdAt).toBeTruthy();
    expect(auctioneer.updatedAt).toBeTruthy();

    expect(savedAuctioneer.id).toBeTruthy();
    expect(savedAuctioneer.firstName).toBe(input.firstName);
    expect(savedAuctioneer.lastName).toBe(input.lastName);
    expect(savedAuctioneer.email).toEqual(input.email);
    expect(savedAuctioneer.registration).toBe(input.registration);
    expect(savedAuctioneer.createdAt).toBeTruthy();
    expect(savedAuctioneer.updatedAt).toBeTruthy();
  });
});
