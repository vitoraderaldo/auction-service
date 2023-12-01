import { Module } from '@nestjs/common';
import AuctionController from '../../@core/auction/infra/api/auction.controller';
import ConfModule from './config.module';
import MongoModule from './mongo.module';
import AuctionMongoRepository from '../../@core/auction/infra/database/repositories/auction-mongo.repository';
import AuctioneerMongoRepository from '../../@core/auction/infra/database/repositories/auctioneer-mongo.repository';
import CreateAuctionUseCase from '../../@core/auction/application/usecase/create-auction.usecase';
import { AuctionRepository } from '../../@core/auction/domain/repositories/auction.repository';
import AuctioneerRepository from '../../@core/auction/domain/repositories/auctioneer.repository';
import HealthController from '../api/health.controller';
import AuctioneerController from '../../@core/auction/infra/api/auctioneer.controller';
import CreateAuctioneerUseCase from '../../@core/auction/application/usecase/create-auctioneer.usecase';
import CreateBidderUseCase from '../../@core/auction/application/usecase/create-bidder.usecase';
import BidderRepository from '../../@core/auction/domain/repositories/bidder.repository';
import BidderMongoRepository from '../../@core/auction/infra/database/repositories/bidder-mongo.repository';
import BidMongoRepository from '../../@core/auction/infra/database/repositories/bid-mongo.repository';
import CreateBidUseCase from '../../@core/auction/application/usecase/create-bid.usecase';
import BidRepository from '../../@core/auction/domain/repositories/bid.repository';
import BidderController from '../../@core/auction/infra/api/bidder.controller';
import PublishAuctionUseCase from '../../@core/auction/application/usecase/publishes-auction.usecase';
import LoggerModule from './logger.module';
import { LoggerInterface } from '../../@core/common/application/service/logger';

@Module({
  imports: [LoggerModule, ConfModule, MongoModule],
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
        loggerInterface: LoggerInterface,
      ) => new CreateAuctionUseCase(auctionRepository, auctioneerRepository, loggerInterface),
      inject: ['AuctionRepository', 'AuctioneerRepository', 'LoggerInterface'],
    },
    {
      provide: CreateAuctioneerUseCase,
      useFactory: (
        auctioneerRepository: AuctioneerRepository,
        loggerInterface: LoggerInterface,
      ) => new CreateAuctioneerUseCase(auctioneerRepository, loggerInterface),
      inject: ['AuctioneerRepository', 'LoggerInterface'],
    },
    {
      provide: CreateBidderUseCase,
      useFactory: (
        bidderRepository: BidderRepository,
        loggerInterface: LoggerInterface,
      ) => new CreateBidderUseCase(bidderRepository, loggerInterface),
      inject: ['BidderRepository', 'LoggerInterface'],
    },
    {
      provide: CreateBidUseCase,
      useFactory: (
        auctionRepository: AuctionRepository,
        bidderRepository: BidderRepository,
        bidRepository: BidRepository,
        loggerInterface: LoggerInterface,
      ) => new CreateBidUseCase(
        auctionRepository,
        bidderRepository,
        bidRepository,
        loggerInterface,
      ),
      inject: ['AuctionRepository', 'BidderRepository', 'BidRepository', 'LoggerInterface'],
    },
    {
      provide: PublishAuctionUseCase,
      useFactory: (
        auctionRepository: AuctionRepository,
        loggerInterface: LoggerInterface,
      ) => new PublishAuctionUseCase(auctionRepository, loggerInterface),
      inject: ['AuctionRepository', 'LoggerInterface'],
    },
  ],
})
export default class AppModule {}
