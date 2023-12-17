import { Module } from '@nestjs/common';
import { Mongoose, connect } from 'mongoose';
import AuctionMongoRepository from '../../@core/auction/infra/database/mongo/repositories/auction-mongo.repository';
import ConfModule from './config.module';
import { EnvironmentConfigInterface } from '../../@core/common/application/service/environment-config.interface';
import AuctionSchema, {
  AuctionModel,
} from '../../@core/auction/infra/database/mongo/schemas/auction.schema';
import AuctioneerMongoRepository from '../../@core/auction/infra/database/mongo/repositories/auctioneer-mongo.repository';
import AuctioneerSchema, {
  AuctioneerModel,
} from '../../@core/auction/infra/database/mongo/schemas/auctioneer.schema';
import BidderSchema, { BidderModel } from '../../@core/auction/infra/database/mongo/schemas/bidder.schema';
import BidSchema, { BidModel } from '../../@core/auction/infra/database/mongo/schemas/bid.schema';
import BidderMongoRepository from '../../@core/auction/infra/database/mongo/repositories/bidder-mongo.repository';
import BidMongoRepository from '../../@core/auction/infra/database/mongo/repositories/bid-mongo.repository';
import BidderNotificationSchema, { BidderNotificationModel } from '../../@core/notification/infra/database/mongo/schemas/bidder-notification.schema';
import BidderNotificationMongoRepository from '../../@core/notification/infra/database/mongo/repositories/bidder-notification-mongo.repository';
import OrderSchema, { OrderModel } from '../../@core/order/infra/database/mongo/schemas/order.schema';
import OrderMongoRepository from '../../@core/order/infra/database/mongo/repositories/order-mongo.repository';

const MONGOOSE_CONNECTION = 'MONGOOSE_CONNECTION';

@Module({
  imports: [ConfModule],
  providers: [
    {
      provide: MONGOOSE_CONNECTION,
      useFactory: (config: EnvironmentConfigInterface) => {
        const mongoConfig = config.getMongo();
        return connect(mongoConfig.uri, {
          dbName: mongoConfig.dbName,
        });
      },
      inject: ['EnvironmentConfigInterface'],
    },
    {
      provide: 'AUCTION_MODEL',
      useFactory: (connection: Mongoose) => AuctionSchema.getModel(connection),
      inject: [MONGOOSE_CONNECTION],
    },
    {
      provide: 'AUCTIONEER_MODEL',
      useFactory: (connection: Mongoose) => AuctioneerSchema.getModel(connection),
      inject: [MONGOOSE_CONNECTION],
    },
    {
      provide: 'BIDDER_MODEL',
      useFactory: (connection: Mongoose) => BidderSchema.getModel(connection),
      inject: [MONGOOSE_CONNECTION],
    },
    {
      provide: 'BID_MODEL',
      useFactory: (connection: Mongoose) => BidSchema.getModel(connection),
      inject: [MONGOOSE_CONNECTION],
    },
    {
      provide: 'BIDDER_NOTIFICATION_MODEL',
      useFactory: (connection: Mongoose) => BidderNotificationSchema.getModel(connection),
      inject: [MONGOOSE_CONNECTION],
    },
    {
      provide: 'ORDER_MODEL',
      useFactory: (connection: Mongoose) => OrderSchema.getModel(connection),
      inject: [MONGOOSE_CONNECTION],
    },
    {
      provide: AuctionMongoRepository,
      useFactory: (
        auctionModel: AuctionModel,
        bidModel: BidModel,
      ) => new AuctionMongoRepository(auctionModel, bidModel),
      inject: ['AUCTION_MODEL', 'BID_MODEL'],
    },
    {
      provide: AuctioneerMongoRepository,
      useFactory: (model: AuctioneerModel) => new AuctioneerMongoRepository(model),
      inject: ['AUCTIONEER_MODEL'],
    },
    {
      provide: BidderMongoRepository,
      useFactory: (model: BidderModel) => new BidderMongoRepository(model),
      inject: ['BIDDER_MODEL'],
    },
    {
      provide: BidMongoRepository,
      useFactory: (model: BidModel) => new BidMongoRepository(model),
      inject: ['BID_MODEL'],
    },
    {
      provide: BidderNotificationMongoRepository,
      useFactory: (model: BidderNotificationModel) => new BidderNotificationMongoRepository(model),
      inject: ['BIDDER_NOTIFICATION_MODEL'],
    },
    {
      provide: OrderMongoRepository,
      useFactory: (model: OrderModel) => new OrderMongoRepository(model),
      inject: ['ORDER_MODEL'],
    },
  ],
  exports: [
    AuctionMongoRepository,
    AuctioneerMongoRepository,
    BidderMongoRepository,
    BidMongoRepository,
    BidderNotificationMongoRepository,
    OrderMongoRepository,
    MONGOOSE_CONNECTION,
  ],
})
export default class MongoModule {}
