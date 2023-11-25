import { Module } from '@nestjs/common';
import { Mongoose, connect } from 'mongoose';
import AuctionMongoRepository from './@core/auction/infra/database/repositories/auction-mongo.repository';
import ConfModule from './config.module';
import { EnvironmentConfigInterface } from './@core/common/domain/environment-config.interface';
import AuctionSchema, { AuctionModel } from './@core/auction/infra/database/schemas/auction.schema';
import AuctioneerMongoRepository from './@core/auction/infra/database/repositories/auctioneer-mongo.repository';
import { AuctioneerModel } from './@core/auction/infra/database/schemas/auctioneer.schema';

const MONGOOSE_CONNECTION = 'MONGOOSE_CONNECTION';

@Module({
  imports: [ConfModule],
  providers: [
    {
      provide: MONGOOSE_CONNECTION,
      useFactory: async (config: EnvironmentConfigInterface) => {
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
      useFactory: (connection: Mongoose) => AuctionSchema.getModel(connection),
      inject: [MONGOOSE_CONNECTION],
    },
    {
      provide: AuctionMongoRepository,
      useFactory: (model: AuctionModel) => new AuctionMongoRepository(model),
      inject: ['AUCTION_MODEL'],
    },
    {
      provide: AuctioneerMongoRepository,
      useFactory: (model: AuctioneerModel) => new AuctioneerMongoRepository(model),
      inject: ['AUCTIONEER_MODEL'],
    },
  ],
  exports: [
    AuctionMongoRepository,
    AuctioneerMongoRepository,
    MONGOOSE_CONNECTION,
  ],

})
export default class MongoModule {}
