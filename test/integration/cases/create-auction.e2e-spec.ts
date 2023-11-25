import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import AppModule from '../../../src/app.module';
import buildAuctioneer from '../../util/auctioneer.mock';
import insertAuctioneer from '../util/insert-auctioneer';
import { AuctionStatusEnum } from '../../../src/@core/auction/domain/value-objects/auction-status.vo';
import AuctionSchema, {
  AuctionModel,
} from '../../../src/@core/auction/infra/database/schemas/auction.schema';

describe('Create Auction (e2e)', () => {
  let app: INestApplication;
  let connection: Mongoose;
  let auctionModel: AuctionModel;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    connection = app.get<Mongoose>('MONGOOSE_CONNECTION');
    auctionModel = AuctionSchema.getModel(connection);
    await app.init();
  });

  afterAll(async () => {
    await connection.disconnect();
    await app.close();
  });

  it('should create an auction', async () => {
    const auctioneer = buildAuctioneer();
    await insertAuctioneer({ auctioneer, connection });

    const in15Minutes = new Date();
    in15Minutes.setMinutes(in15Minutes.getMinutes() + 15);

    const in15Days = new Date();
    in15Days.setDate(in15Days.getDate() + 15);

    const body = {
      auctioneerId: auctioneer.getId(),
      title: 'Auction title',
      description: 'Auction Description',
      startPrice: 105.4,
      startDate: in15Minutes.toISOString(),
      endDate: in15Days.toISOString(),
      photos: [],
    };

    const response = await request(app.getHttpServer())
      .post('/v1/auction')
      .send(body)
      .expect(201);

    const savedAuction = await auctionModel.findOne({ id: response.body.id });
    const auction = response.body;

    expect(auction.id).toBeTruthy();
    expect(auction.title).toBe(body.title);
    expect(auction.description).toBe(body.description);
    expect(auction.photos).toEqual(body.photos);
    expect(auction.startDate).toBe(body.startDate);
    expect(auction.endDate).toBe(body.endDate);
    expect(auction.startPrice).toBe(body.startPrice);
    expect(auction.currentPrice).toBe(null);
    expect(auction.status).toBe(AuctionStatusEnum.CREATED);
    expect(auction.auctioneerId).toBe(body.auctioneerId);
    expect(auction.createdAt).toBeTruthy();
    expect(auction.updatedAt).toBeTruthy();

    expect(savedAuction.id).toEqual(auction.id);
    expect(savedAuction.title).toEqual(body.title);
    expect(savedAuction.description).toEqual(body.description);
    expect(savedAuction.photos).toEqual(body.photos);
    expect(savedAuction.startDate).toEqual(body.startDate);
    expect(savedAuction.endDate).toEqual(body.endDate);
    expect(savedAuction.startPrice).toEqual(body.startPrice);
    expect(savedAuction.currentPrice).toEqual(auction.currentPrice);
    expect(savedAuction.status).toEqual(auction.status);
    expect(savedAuction.auctioneerId).toEqual(body.auctioneerId);
    expect(savedAuction.createdAt).toBeTruthy();
    expect(savedAuction.updatedAt).toBeTruthy();
  });
});
