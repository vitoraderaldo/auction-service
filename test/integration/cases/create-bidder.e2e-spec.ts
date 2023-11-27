import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import AppModule from '../../../src/app.module';
import buildBidder from '../../util/bidder.mock';
import BidderSchema, { BidderModel } from '../../../src/@core/auction/infra/database/schemas/bidder.schema';

describe('Create Bidder (e2e)', () => {
  let app: INestApplication;
  let connection: Mongoose;
  let bidderModel: BidderModel;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    connection = app.get<Mongoose>('MONGOOSE_CONNECTION');
    bidderModel = BidderSchema.getModel(connection);
    await app.init();
  });

  afterAll(async () => {
    await connection.disconnect();
    await app.close();
  });

  it('should create an bidder', async () => {
    const data = buildBidder().toJSON();

    const input = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/bidder')
      .send(input)
      .expect(201);

    const savedBidder = await bidderModel.findOne({ id: response.body.id });
    const bidder = response.body;

    expect(bidder.id).toBeTruthy();
    expect(bidder.firstName).toBe(input.firstName);
    expect(bidder.lastName).toBe(input.lastName);
    expect(bidder.email).toEqual(input.email);
    expect(bidder.createdAt).toBeTruthy();
    expect(bidder.updatedAt).toBeTruthy();

    expect(savedBidder.id).toBeTruthy();
    expect(savedBidder.firstName).toBe(input.firstName);
    expect(savedBidder.lastName).toBe(input.lastName);
    expect(savedBidder.email).toEqual(input.email);
    expect(savedBidder.createdAt).toBeTruthy();
    expect(savedBidder.updatedAt).toBeTruthy();
  });
});
