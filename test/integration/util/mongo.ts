import { Mongoose } from 'mongoose';
import { INestApplication } from '@nestjs/common';
import AuctionSchema, { AuctionModel } from '../../../src/@core/auction/infra/database/mongo/schemas/auction.schema';
import BidderNotificationSchema, { BidderNotificationModel } from '../../../src/@core/notification/infra/database/mongo/schemas/bidder-notification.schema';
import OrderSchema, { OrderModel } from '../../../src/@core/order/infra/database/mongo/schemas/order.schema';
import BidSchema, { BidModel } from '../../../src/@core/auction/infra/database/mongo/schemas/bid.schema';
import AuctioneerSchema, { AuctioneerModel } from '../../../src/@core/auction/infra/database/mongo/schemas/auctioneer.schema';
import BidderSchema, { BidderModel } from '../../../src/@core/auction/infra/database/mongo/schemas/bidder.schema';

export interface Models {
  auctionModel: AuctionModel;
  bidderNotificationModel: BidderNotificationModel;
  orderModel: OrderModel;
  bidModel: BidModel;
  auctioneerModel: AuctioneerModel;
  bidderModel: BidderModel;
}

export const getMongoConnection = (app: INestApplication): Mongoose => (
  app.get<Mongoose>('MONGOOSE_CONNECTION')
);

export const getModels = (connection: Mongoose): Models => ({
  auctionModel: AuctionSchema.getModel(connection),
  bidderNotificationModel: BidderNotificationSchema.getModel(connection),
  orderModel: OrderSchema.getModel(connection),
  bidModel: BidSchema.getModel(connection),
  auctioneerModel: AuctioneerSchema.getModel(connection),
  bidderModel: BidderSchema.getModel(connection),
});

export const clearDatabase = async (connection: Mongoose) => {
  await connection.models.BidderNotification.deleteMany({});
  await connection.models.Order.deleteMany({});
  await connection.models.Bid.deleteMany({});
  await connection.models.Auction.deleteMany({});
  await connection.models.Auctioneer.deleteMany({});
  await connection.models.Bidder.deleteMany({});
};
