import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import buildAuctioneer from '../../util/auctioneer.mock';
import insertAuctioneer from '../util/insert-auctioneer';
import { AuctionStatusEnum } from '../../../src/@core/auction/domain/value-objects/auction-status.vo';
import buildAuction from '../../util/auction.mock';
import insertAuction from '../util/insert-auction';
import buildBidder from '../../util/bidder.mock';
import insertBidder from '../util/insert-bidder';
import BidSchema, { BidModel } from '../../../src/@core/auction/infra/database/schemas/bid.schema';
import Auctioneer from '../../../src/@core/auction/domain/entities/auctioneer.entity';
import Auction from '../../../src/@core/auction/domain/entities/auction.entity';
import Bidder from '../../../src/@core/auction/domain/entities/bidder.entity';
import { startTestingApp, getMongoConnection } from '../util/testing-app';
import { ErrorCode } from '../../../src/@core/common/error/domain.error';

describe('Bid (e2e)', () => {
  let app: INestApplication;
  let connection: Mongoose;
  let bidModel: BidModel;

  let auctioneer: Auctioneer;
  let auction: Auction;
  let bidder1: Bidder;
  let startPrice: number;
  let auctionId: string;

  beforeEach(async () => {
    app = await startTestingApp();

    connection = getMongoConnection(app);
    bidModel = BidSchema.getModel(connection);
    await app.init();

    auctioneer = buildAuctioneer();
    await insertAuctioneer({ auctioneer, connection });

    bidder1 = buildBidder();
    await insertBidder({ bidder: bidder1, connection });

    startPrice = 500;
    auction = buildAuction({
      startPrice,
      auctioneerId: auctioneer.getId(),
      status: AuctionStatusEnum.PUBLISHED,
    });
    await insertAuction({ auction, connection });

    auctionId = auction.getId();
  });

  afterAll(async () => {
    await connection.disconnect();
    await app.close();
  });

  it('should add a bid to an auction', async () => {
    const input = {
      bidderId: bidder1.getId(),
      value: startPrice,
    };

    const response = await request(app.getHttpServer())
      .post(`/v1/auction/${auctionId}/bid`)
      .set('Authorization', bidder1.getId())
      .send(input)
      .expect(201);

    const auctionBids = await bidModel.find({ auctionId });
    const savedBid = auctionBids?.at(0);

    expect(auctionBids).toHaveLength(1);
    expect(savedBid.id).toEqual(response.body.id);
    expect(savedBid.auctionId).toEqual(auctionId);
    expect(savedBid.bidderId).toEqual(bidder1.getId());
    expect(savedBid.value).toEqual(input.value);
    expect(savedBid.createdAt).toBeTruthy();
    expect(savedBid.updatedAt).toBeTruthy();

    expect(response.body.id).toBeTruthy();
    expect(response.body.auctionId).toEqual(auctionId);
    expect(response.body.bidderId).toEqual(bidder1.getId());
    expect(response.body.value).toEqual(input.value);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.updatedAt).toBeTruthy();
  });

  it('should throw an error when bid is not higher than other bids', async () => {
    const bidder2 = buildBidder();
    await insertBidder({ bidder: bidder2, connection });

    const firstBid = {
      bidderId: bidder1.getId(),
      value: startPrice + 100,
    };
    await request(app.getHttpServer())
      .post(`/v1/auction/${auctionId}/bid`)
      .set('Authorization', bidder1.getId())
      .send(firstBid)
      .expect(201);

    const secondBid = {
      bidderId: bidder2.getId(),
      value: startPrice + 100,
    };

    const response = await request(app.getHttpServer())
      .post(`/v1/auction/${auctionId}/bid`)
      .set('Authorization', bidder2.getId())
      .send(secondBid)
      .expect(500);

    const errorCode = response?.body?.errorCode;
    const errorDetails = response?.body?.errorDetails;
    const auctionBids = await bidModel.find({ auctionId });
    const savedBid = auctionBids?.at(0);

    expect(errorCode).toEqual(ErrorCode.INVALID_BID_AMOUNT);
    expect(errorDetails).toEqual({
      auctionId,
      highestBid: firstBid.value,
      value: secondBid.value,
    });

    expect(auctionBids).toHaveLength(1);
    expect(savedBid.auctionId).toEqual(auctionId);
    expect(savedBid.bidderId).toEqual(bidder1.getId());
    expect(savedBid.value).toEqual(firstBid.value);
  });
});
