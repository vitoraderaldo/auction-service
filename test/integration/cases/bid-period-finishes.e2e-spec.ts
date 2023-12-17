import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Mongoose } from 'mongoose';
import { faker } from '@faker-js/faker';
import { AuctionStatusEnum } from '../../../src/@core/auction/domain/value-objects/auction-status.vo';
import buildAuction from '../../util/auction.mock';
import insertAuction from '../util/insert-auction';
import Auction from '../../../src/@core/auction/domain/entities/auction.entity';
import { startTestingApp, getMongoConnection } from '../util/testing-app';
import AuctionSchema, { AuctionModel } from '../../../src/@core/auction/infra/database/mongo/schemas/auction.schema';
import { BidPeriodHasFinishedOutput } from '../../../src/@core/auction/application/usecase/bid-period-has-finished.usecase';
import Bidder from '../../../src/@core/auction/domain/entities/bidder.entity';
import buildBidder from '../../util/bidder.mock';
import insertBidder from '../util/insert-bidder';
import buildBid from '../../util/bid.mock';
import Price from '../../../src/@core/common/domain/value-objects/price.vo';
import insertBid from '../util/insert-bid';
import SendgridMockClient, { SendgridEmail } from '../util/sendgrid-mock-client';
import LocalStackSqs from '../util/sqs-mock.client';
import runWithRetries from '../util/fetch-data-recursively';
import BidderNotificationSchema, { BidderNotificationModel } from '../../../src/@core/notification/infra/database/mongo/schemas/bidder-notification.schema';
import OrderSchema, { OrderModel } from '../../../src/@core/order/infra/database/mongo/schemas/order.schema';
import { PaymentResponsibilityEnum } from '../../../src/@core/order/domain/value-objects/payment-responsibility.vo';
import { PaymentStatusEnum } from '../../../src/@core/order/domain/value-objects/payment-status.vo';
import { NotificationChannel, NotificationType } from '../../../src/@core/notification/application/service/notification-type';

describe('Bid Period Finishes', () => {
  let app: INestApplication;
  let connection: Mongoose;
  let auctionModel: AuctionModel;
  let bidderNotificationModel: BidderNotificationModel;
  let orderModel: OrderModel;

  let auction: Auction;
  let auctionId: string;

  let bidder: Bidder;

  const sendGridMockClient = SendgridMockClient.create();

  beforeAll(async () => {
    app = await startTestingApp();
    connection = getMongoConnection(app);
    auctionModel = AuctionSchema.getModel(connection);
    bidderNotificationModel = BidderNotificationSchema.getModel(connection);
    orderModel = OrderSchema.getModel(connection);
    await app.init();
  });

  beforeEach(async () => {
    await LocalStackSqs.purgeAppQueues(app);

    const oneMonthAgo = new Date();
    oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);

    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setUTCMinutes(fiveMinutesAgo.getUTCMinutes() - 5);

    auction = buildAuction({
      startDate: oneMonthAgo.toISOString(),
      endDate: fiveMinutesAgo.toISOString(),
      auctioneerId: faker.string.uuid(),
      status: AuctionStatusEnum.PUBLISHED,
    });
    await insertAuction({ auction, connection });

    bidder = buildBidder({
    });
    await insertBidder({ bidder, connection });

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

  it('should update auction status when bid period finishes', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auction/change-status')
      .set('Authorization', faker.string.uuid())
      .send()
      .expect(200);

    const savedAuction = await auctionModel.findOne({
      id: auctionId,
    }).exec();

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

  it('should create an order and send 2 emails to winning bidder when bid period finishes', async () => {
    const bidValue = auction.getStartPrice();
    const bid = buildBid({
      auctionId: auction.getId(),
      bidderId: bidder.getId(),
      value: new Price(bidValue),
    });
    await insertBid({ bid, connection });

    const response = await request(app.getHttpServer())
      .post('/v1/auction/change-status')
      .set('Authorization', faker.string.uuid())
      .send()
      .expect(200);

    const savedAuction = await auctionModel.findOne({
      id: auctionId,
    }).exec();

    const emails = await runWithRetries<SendgridEmail[]>(
      () => sendGridMockClient.getEmailsSentTo(bidder.getEmail()),
    );

    const savedNotifications = await bidderNotificationModel.find({
      bidderId: bidder.getId(),
      auctionId: auction.getId(),
    }).exec();

    const savedOrder = await orderModel.findOne({
      auctionId,
    }).exec();

    expect(savedAuction.id).toEqual(auctionId);
    expect(savedAuction.status).toEqual(AuctionStatusEnum.BID_PERIOD_FINISHED);

    const { body } : { body: BidPeriodHasFinishedOutput } = response;

    expect(body.total).toEqual(1);
    expect(body.success).toEqual(1);

    expect(savedOrder.id).toBeDefined();
    expect(savedOrder.auctionId).toEqual(auctionId);
    expect(savedOrder.bidderId).toEqual(bidder.getId());
    expect(savedOrder.auctionFinalValue).toEqual(bidValue);
    expect(savedOrder.paymentResponsibility).toEqual(PaymentResponsibilityEnum.SYSTEM);
    expect(savedOrder.paymentStatus).toEqual(PaymentStatusEnum.PENDING);
    expect(savedOrder.dueDate).toBeDefined();
    expect(savedOrder.paidAt).toBeNull();
    expect(savedOrder.paidValue).toBeNull();

    expect(savedNotifications).toHaveLength(2);
    expect(savedNotifications).toEqual(expect.arrayContaining([
      expect.objectContaining({
        bidderId: bidder.getId(),
        channel: NotificationChannel.EMAIL,
        type: NotificationType.NOTIFY_WINNING_BIDDER,
        auctionId: auction.getId(),
        sentAt: expect.any(String),
      }),
      expect.objectContaining({
        bidderId: bidder.getId(),
        channel: NotificationChannel.EMAIL,
        type: NotificationType.NOTIFY_BIDDER_ABOUT_PAYMENT,
        auctionId: auction.getId(),
        sentAt: expect.any(String),
      }),
    ]));

    expect(emails).toHaveLength(2);
    expect([
      emails[0].template_id,
      emails[1].template_id,
    ]).toEqual(expect.arrayContaining([
      'sendgrid-template-notify-winning-bidder',
      'sendgrid-template-payment-request-for-auction',
    ]));
  });
});
