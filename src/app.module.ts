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

@Module({
  imports: [ConfModule, MongoModule],
  controllers: [HealthController, AuctionController],
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
      provide: CreateAuctionUseCase,
      useFactory: (
        auctionRepository: AuctionRepository,
        auctioneerRepository: AuctioneerRepository,
      ) => new CreateAuctionUseCase(auctionRepository, auctioneerRepository),
      inject: ['AuctionRepository', 'AuctioneerRepository'],
    },
  ],
})
export default class AppModule {}
