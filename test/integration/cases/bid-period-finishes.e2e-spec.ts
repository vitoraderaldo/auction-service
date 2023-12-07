import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import { randomUUID } from 'crypto';
import { AuctionStatusEnum } from '../../../src/@core/auction/domain/value-objects/auction-status.vo';
import buildAuction from '../../util/auction.mock';
import insertAuction from '../util/insert-auction';
import Auction from '../../../src/@core/auction/domain/entities/auction.entity';
import { startTestingApp, getMongoConnection } from '../util/testing-app';
import AuctionSchema, { AuctionModel } from '../../../src/@core/auction/infra/database/schemas/auction.schema';
import { BidPeriodHasFinishedOutput } from '../../../src/@core/auction/application/usecase/bid-period-has-finished.usecase';

describe('Bid Period Finishes', () => {
  let app: INestApplication;
  let connection: Mongoose;
  let auctionModel: AuctionModel;

  let auction: Auction;
  let auctionId: string;

  beforeEach(async () => {
    app = await startTestingApp();

    connection = getMongoConnection(app);
    auctionModel = AuctionSchema.getModel(connection);
    await app.init();

    const oneMonthAgo = new Date();
    oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);

    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setUTCMinutes(fiveMinutesAgo.getUTCMinutes() - 5);

    auction = buildAuction({
      startDate: oneMonthAgo.toISOString(),
      endDate: fiveMinutesAgo.toISOString(),
      auctioneerId: randomUUID(),
      status: AuctionStatusEnum.PUBLISHED,
    });
    await insertAuction({ auction, connection });

    auctionId = auction.getId();

    const auctionStillInBidPeriod = buildAuction({
      status: AuctionStatusEnum.PUBLISHED,
    });
    await insertAuction({ auction: auctionStillInBidPeriod, connection });
  });

  afterAll(async () => {
    await connection.disconnect();
    await app.close();
  });

  it('should finish bid period when end date is reached', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auction/change-status')
      .set('Authorization', randomUUID())
      .send()
      .expect(200);

    const savedAuction = await auctionModel.findOne({
      id: auctionId,
    });

    expect(savedAuction.id).toEqual(auctionId);
    expect(savedAuction.status).toEqual(AuctionStatusEnum.BID_PERIOD_FINISHED);

    const { body } : { body: BidPeriodHasFinishedOutput } = response;

    expect(body.total).toEqual(1);
    expect(body.success).toEqual(1);
    expect(body.failure).toEqual(0);
    expect(body.updatedAuctions).toEqual([{
      id: auctionId,
      status: AuctionStatusEnum.BID_PERIOD_FINISHED,
    }]);
  });
});