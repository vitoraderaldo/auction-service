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
import BidPeriodHasFinishedUseCase from '../../@core/auction/application/usecase/bid-period-has-finished.usecase';
import DomainEventManager from '../../@core/common/domain/domain-event-manager';
import { EventPublisher } from '../../@core/common/domain/domain-events/event-publisher';
import DomainEventManagerFactory from '../../@core/common/domain/domain-event-manager.factory';
import EmailNotificationQueueStrategy from '../../@core/notification/application/service/email/email-notification-queue.strategy';
import QueueMessagePublisher from '../../@core/common/application/service/queue-message-publisher';
import EmailSqsPublisher from '../../@core/notification/infra/queue/sqs/client/email-sqs-publisher';
import SmsSqsPublisher from '../../@core/notification/infra/queue/sqs/client/sms-sqs-publisher';
import SmsNotificationQueueStrategy from '../../@core/notification/application/service/sms/sms-notification-queue.strategy';
import NotificationStrategyFactory from '../../@core/notification/application/service/notification-strategy.factory';
import NotifyWinningBidderHandler from '../../@core/notification/application/event-handlers/notify-winning-bidder';
import SqsProducer from '../../@core/notification/infra/queue/sqs/client/sqs-producer';
import { EnvironmentConfigInterface } from '../../@core/common/domain/environment-config.interface';
import { SqsPublisher } from '../../@core/notification/infra/queue/sqs/client/sqs-publisher.interface';
import { SqsHelper } from '../../@core/notification/infra/queue/sqs/client/sqs-helper';
import EmailNotificationSqsQueueConsumer from '../../@core/notification/infra/queue/sqs/consumers/email-notification-sqs.consumer';
import SqsConsumer from '../../@core/notification/infra/queue/sqs/client/sqs-consumer';
import { SqsConsumerInterface } from '../../@core/notification/infra/queue/sqs/client/sqs-consumer.interface';
import BidderNotificationMongoRepository from '../../@core/notification/infra/database/repositories/bidder-notification-mongo.repository';
import BidderNotificationRepository from '../../@core/notification/domain/repositories/bidder-notification.repository';
import EmailNotificationHandler from '../../@core/notification/application/queue-handlers/email-notiication-queue.handler';
import EmailModule from './email.module';
import EmailSender from '../../@core/notification/application/service/email/email.types';
import SendEmailToWinnerUseCase from '../../@core/notification/application/usecase/send-email-to-winner.usecase';

@Module({
  imports: [LoggerModule, ConfModule, MongoModule, EmailModule],
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
      provide: 'BidderNotificationRepository',
      useFactory: async (mongoRepository: BidderNotificationMongoRepository) => mongoRepository,
      inject: [BidderNotificationMongoRepository],
    },
    {
      provide: SqsHelper,
      useFactory: async (
        envConfig: EnvironmentConfigInterface,
      ) => new SqsHelper(
        envConfig.getAws(),
        envConfig.getEnvName(),
      ),
      inject: ['EnvironmentConfigInterface'],
    },
    {
      provide: 'SqsPublisher',
      useFactory: (sqsHelper: SqsHelper) => new SqsProducer(sqsHelper),
      inject: [SqsHelper],
    },
    {
      provide: 'EMAIL_QUEUE',
      useFactory: async (
        logger: LoggerInterface,
        sqsPublisher: SqsPublisher,
      ) => new EmailSqsPublisher(
        logger,
        sqsPublisher,
      ),
      inject: ['LoggerInterface', 'SqsPublisher'],
    },
    {
      provide: 'SMS_QUEUE',
      useFactory: async (
        logger: LoggerInterface,
        sqsPublisher: SqsPublisher,
      ) => new SmsSqsPublisher(logger, sqsPublisher),
      inject: ['LoggerInterface', 'SqsPublisher'],
    },
    {
      provide: EmailNotificationQueueStrategy,
      useFactory: async (
        emailQueue: QueueMessagePublisher,
      ) => new EmailNotificationQueueStrategy(emailQueue),
      inject: ['EMAIL_QUEUE'],
    },
    {
      provide: SmsNotificationQueueStrategy,
      useFactory: async (
        smsQueue: QueueMessagePublisher,
      ) => new SmsNotificationQueueStrategy(smsQueue),
      inject: ['SMS_QUEUE'],
    },
    {
      provide: 'SqsConsumerInterface',
      useFactory: async (
        sqsHelper: SqsHelper,
      ) => new SqsConsumer(sqsHelper),
      inject: [SqsHelper],
    },
    {
      provide: SendEmailToWinnerUseCase,
      useFactory: (
        logger: LoggerInterface,
        emailSender: EmailSender,
        bidderRepository: BidderRepository,
        bidderNotificationRepository: BidderNotificationRepository,
        bidRepository: BidRepository,
        auctionRepository: AuctionRepository,
        config: EnvironmentConfigInterface,
      ) => new SendEmailToWinnerUseCase(
        logger,
        emailSender,
        bidderRepository,
        bidderNotificationRepository,
        bidRepository,
        auctionRepository,
        config.getDefaultSenderEmail(),
      ),
      inject: ['LoggerInterface', 'EmailSender', 'BidderRepository', 'BidderNotificationRepository', 'BidRepository', 'AuctionRepository', 'EnvironmentConfigInterface'],
    },
    {
      provide: EmailNotificationHandler,
      useFactory: (
        logger: LoggerInterface,
        sendEmailToWinnerUseCase: SendEmailToWinnerUseCase,
      ) => new EmailNotificationHandler(
        logger,
        sendEmailToWinnerUseCase,
      ),
      inject: ['LoggerInterface', SendEmailToWinnerUseCase],
    },
    {
      provide: EmailNotificationSqsQueueConsumer,
      useFactory: (
        sqsConsumer: SqsConsumerInterface,
        emailNotificationHandler: EmailNotificationHandler,
        logger: LoggerInterface,
      ) => new EmailNotificationSqsQueueConsumer(
        sqsConsumer,
        emailNotificationHandler,
        logger,
      ),
      inject: ['SqsConsumerInterface', EmailNotificationHandler, 'LoggerInterface'],
    },
    {
      provide: NotificationStrategyFactory,
      useFactory: async (
        emailStrategy: EmailNotificationQueueStrategy,
        smsStrategy: SmsNotificationQueueStrategy,
      ) => new NotificationStrategyFactory(emailStrategy, smsStrategy),
      inject: [EmailNotificationQueueStrategy, SmsNotificationQueueStrategy],
    },
    {
      provide: NotifyWinningBidderHandler,
      useFactory: async (
        strategyFactory: NotificationStrategyFactory,
      ) => {
        const result = new NotifyWinningBidderHandler(strategyFactory);
        return result;
      },
      inject: [NotificationStrategyFactory],
    },
    {
      provide: DomainEventManagerFactory,
      useFactory: async (
        logger: LoggerInterface,
        notifyWinningBidder: NotifyWinningBidderHandler,
      ) => new DomainEventManagerFactory(logger, notifyWinningBidder),
      inject: ['LoggerInterface', NotifyWinningBidderHandler],
    },
    {
      provide: DomainEventManager,
      useFactory: async (factory: DomainEventManagerFactory) => factory.getInstance(),
      inject: [DomainEventManagerFactory],
    },
    {
      provide: 'EventPublisher',
      useFactory: async (eventManager: DomainEventManager) => eventManager,
      inject: [DomainEventManager],
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
    {
      provide: BidPeriodHasFinishedUseCase,
      useFactory: (
        auctionRepository: AuctionRepository,
        loggerInterface: LoggerInterface,
        eventPublisher: EventPublisher,
      ) => new BidPeriodHasFinishedUseCase(auctionRepository, eventPublisher, loggerInterface),
      inject: ['AuctionRepository', 'LoggerInterface', 'EventPublisher'],
    },
  ],
})
export default class AppModule {}
