import { Module } from '@nestjs/common';
import AuctionController from './@core/auction/infra/api/auction.controller';
import ConfModule from './config.module';
import MongoModule from './mongo.module';
import AuctionMongoRepository from './@core/auction/infra/database/repositories/auction-mongo.repository';
import AuctioneerMongoRepository from './@core/auction/infra/database/repositories/auctioneer-mongo.repository';
import CreateAuctionUseCase from './@core/auction/application/create-auction.usecase';
import { AuctionRepository } from './@core/auction/domain/repositories/auction.repository';
import AuctioneerRepository from './@core/auction/domain/repositories/auctioneer.repository';
import HealthController from './health.controller';
import AuctioneerController from './@core/auction/infra/api/auctioneer.controller';
import CreateAuctioneerUseCase from './@core/auction/application/create-auctioneer.usecase';
import CreateBidderUseCase from './@core/auction/application/create-bidder.usecase';
import BidderRepository from './@core/auction/domain/repositories/bidder.repository';
import BidderMongoRepository from './@core/auction/infra/database/repositories/bidder-mongo.repository';
import BidMongoRepository from './@core/auction/infra/database/repositories/bid-mongo.repository';
import CreateBidUseCase from './@core/auction/application/create-bid.usecase';
import BidRepository from './@core/auction/domain/repositories/bid.repository';
import BidderController from './@core/auction/infra/api/bidder.controller';
import PublishAuctionUseCase from './@core/auction/application/publishes-auction.usecase';

@Module({
  imports: [ConfModule, MongoModule],
  controllers: [HealthController, AuctionController, AuctioneerController, BidderController],
  providers: [
    {
      provide: 'AuctionRepository',
      useFactory: async (mongoRepository: AuctionMongoRepository) => mongoRepository,
      inject: [AuctionMongoRepository],
    },
    {
      provide: 'AuctioneerRepository',
      useFactory: async (mongoRepository: AuctioneerMongoRepository) => mongoRepository,
      inject: [AuctioneerMongoRepository],
    },
    {
      provide: 'BidderRepository',
      useFactory: async (mongoRepository: BidderMongoRepository) => mongoRepository,
      inject: [BidderMongoRepository],
    },
    {
      provide: 'BidRepository',
      useFactory: async (mongoRepository: BidMongoRepository) => mongoRepository,
      inject: [BidMongoRepository],
    },
    {
      provide: CreateAuctionUseCase,
      useFactory: (
        auctionRepository: AuctionRepository,
        auctioneerRepository: AuctioneerRepository,
      ) => new CreateAuctionUseCase(auctionRepository, auctioneerRepository),
      inject: ['AuctionRepository', 'AuctioneerRepository'],
    },
    {
      provide: CreateAuctioneerUseCase,
      useFactory: (
        auctioneerRepository: AuctioneerRepository,
      ) => new CreateAuctioneerUseCase(auctioneerRepository),
      inject: ['AuctioneerRepository'],
    },
    {
      provide: CreateBidderUseCase,
      useFactory: (
        bidderRepository: BidderRepository,
      ) => new CreateBidderUseCase(bidderRepository),
      inject: ['BidderRepository'],
    },
    {
      provide: CreateBidUseCase,
      useFactory: (
        auctionRepository: AuctionRepository,
        bidderRepository: BidderRepository,
        bidRepository: BidRepository,
      ) => new CreateBidUseCase(auctionRepository, bidderRepository, bidRepository),
      inject: ['AuctionRepository', 'BidderRepository', 'BidRepository'],
    },
    {
      provide: PublishAuctionUseCase,
      useFactory: (
        auctionRepository: AuctionRepository,
      ) => new PublishAuctionUseCase(auctionRepository),
      inject: ['AuctionRepository'],
    },
  ],
})
export default class AppModule {}
