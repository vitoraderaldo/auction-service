import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import buildAuctioneer from '../../util/auctioneer.mock';
import insertAuctioneer from '../util/insert-auctioneer';
import { AuctionStatusEnum } from '../../../src/@core/auction/domain/value-objects/auction-status.vo';
import AuctionSchema, {
  AuctionModel,
} from '../../../src/@core/auction/infra/database/schemas/auction.schema';
import buildAuction from '../../util/auction.mock';
import Uuid from '../../../src/@core/common/domain/value-objects/uuid.vo';
import insertAuction from '../util/insert-auction';
import { getMongoConnection, startTestingApp } from '../util/testing-app';

describe('Auction (e2e)', () => {
  let app: INestApplication;
  let connection: Mongoose;
  let auctionModel: AuctionModel;

  beforeAll(async () => {
    app = await startTestingApp();
    connection = getMongoConnection(app);
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
      .set('Authorization', auctioneer.getId())
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
    expect(savedAuction.status).toEqual(auction.status);
    expect(savedAuction.auctioneerId).toEqual(body.auctioneerId);
    expect(savedAuction.createdAt).toBeTruthy();
    expect(savedAuction.updatedAt).toBeTruthy();
  });

  it('should publish an auction', async () => {
    const auctioneer = buildAuctioneer({
      id: new Uuid(faker.string.uuid()),
    });
    await insertAuctioneer({ auctioneer, connection });

    const auctionId = faker.string.uuid();
    const auction = buildAuction({
      id: new Uuid(auctionId),
      auctioneerId: auctioneer.getId(),
    });
    await insertAuction({ auction, connection });

    await request(app.getHttpServer())
      .post(`/v1/auction/${auctionId}/publish`)
      .set('Authorization', auctioneer.getId())
      .expect(200);

    const savedAuction = await auctionModel.findOne({ id: auctionId });
    expect(savedAuction.status).toEqual(AuctionStatusEnum.PUBLISHED);
  });
});
