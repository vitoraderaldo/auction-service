import { Module } from '@nestjs/common';
import AuctionController from '../../@core/auction/infra/api/nest/auction.controller';
import ConfModule from './config.module';
import MongoModule from './mongo.module';
import AuctionMongoRepository from '../../@core/auction/infra/database/mongo/repositories/auction-mongo.repository';
import AuctioneerMongoRepository from '../../@core/auction/infra/database/mongo/repositories/auctioneer-mongo.repository';
import CreateAuctionUseCase from '../../@core/auction/application/usecase/create-auction.usecase';
import { AuctionRepository } from '../../@core/auction/domain/repositories/auction.repository';
import AuctioneerRepository from '../../@core/auction/domain/repositories/auctioneer.repository';
import HealthController from '../api/health.controller';
import AuctioneerController from '../../@core/auction/infra/api/nest/auctioneer.controller';
import CreateAuctioneerUseCase from '../../@core/auction/application/usecase/create-auctioneer.usecase';
import CreateBidderUseCase from '../../@core/auction/application/usecase/create-bidder.usecase';
import BidderRepository from '../../@core/auction/domain/repositories/bidder.repository';
import BidderMongoRepository from '../../@core/auction/infra/database/mongo/repositories/bidder-mongo.repository';
import BidMongoRepository from '../../@core/auction/infra/database/mongo/repositories/bid-mongo.repository';
import CreateBidUseCase from '../../@core/auction/application/usecase/create-bid.usecase';
import BidRepository from '../../@core/auction/domain/repositories/bid.repository';
import BidderController from '../../@core/auction/infra/api/nest/bidder.controller';
import PublishAuctionUseCase from '../../@core/auction/application/usecase/publishes-auction.usecase';
import LoggerModule from './logger.module';
import { LoggerInterface } from '../../@core/common/application/service/logger';
import BidPeriodHasFinishedUseCase from '../../@core/auction/application/usecase/bid-period-has-finished.usecase';
import DomainEventManagerFactory from '../../@core/common/domain/domain-events/domain-event-manager.factory';
import EmailNotificationQueueStrategy from '../../@core/notification/application/service/email/email-notification-queue.strategy';
import QueueMessagePublisher from '../../@core/common/application/service/queue-message-publisher';
import EmailSqsPublisher from '../../@core/notification/infra/queue/sqs/client/email-sqs-publisher';
import SmsSqsPublisher from '../../@core/notification/infra/queue/sqs/client/sms-sqs-publisher';
import SmsNotificationQueueStrategy from '../../@core/notification/application/service/sms/sms-notification-queue.strategy';
import NotificationStrategyFactory from '../../@core/notification/application/service/notification-strategy.factory';
import NotifyWinningBidderHandler from '../../@core/notification/application/event-handlers/notify-winning-bidder';
import SqsProducer from '../../@core/notification/infra/queue/sqs/client/sqs-producer';
import { EnvironmentConfigInterface } from '../../@core/common/application/service/environment-config.interface';
import { SqsPublisher } from '../../@core/notification/infra/queue/sqs/client/sqs-publisher.interface';
import { SqsHelper } from '../../@core/notification/infra/queue/sqs/client/sqs-helper';
import EmailNotificationSqsQueueConsumer from '../../@core/notification/infra/queue/sqs/consumers/email-notification-sqs.consumer';
import SqsConsumer from '../../@core/notification/infra/queue/sqs/client/sqs-consumer';
import { SqsConsumerInterface } from '../../@core/notification/infra/queue/sqs/client/sqs-consumer.interface';
import BidderNotificationMongoRepository from '../../@core/notification/infra/database/mongo/repositories/bidder-notification-mongo.repository';
import BidderNotificationRepository from '../../@core/notification/domain/repositories/bidder-notification.repository';
import EmailNotificationHandler from '../../@core/notification/application/queue-handlers/email-notiication-queue.handler';
import EmailModule from './email.module';
import EmailSender from '../../@core/notification/application/service/email/email.types';
import SendEmailToWinnerUseCase from '../../@core/notification/application/usecase/send-email-to-winner.usecase';
import { DomainEventManagerInterface, EventPublisher } from '../../@core/common/domain/domain-events/domain-event';
import TriggerOrderCreationHandler from '../../@core/order/application/event-handlers/trigger-order-creation';
import DomainEventType from '../../@core/common/domain/domain-events/domain-event.type';
import CreateFirstAuctionOrderUseCase from '../../@core/order/application/usecase/create-first-auction-order.usecase';
import OrderSqsPublisher from '../../@core/order/infra/queue/sqs/client/order-sqs-publisher';
import OrderSqsQueueConsumer from '../../@core/order/infra/queue/sqs/consumers/order-sqs.consumer';
import OrderQueueHandler from '../../@core/order/application/queue-handlers/order-queue.handler';
import OrderMongoRepository from '../../@core/order/infra/database/mongo/repositories/order-mongo.repository';
import OrderRepository from '../../@core/order/domain/repositories/order.repository';
import { ErrorLogger } from '../../@core/common/infra/api/nest/error-parser';
import SendPaymentRequestEmailToWinnerUseCase from '../../@core/notification/application/usecase/send-payment-request-email-to-winner.usecase';

@Module({
  imports: [LoggerModule, ConfModule, MongoModule, EmailModule],
  controllers: [HealthController, AuctionController, AuctioneerController, BidderController],
  providers: [
    {
      provide: 'AuctionRepository',
      useFactory: (mongoRepository: AuctionMongoRepository) => mongoRepository,
      inject: [AuctionMongoRepository],
    },
    {
      provide: 'AuctioneerRepository',
      useFactory: (mongoRepository: AuctioneerMongoRepository) => mongoRepository,
      inject: [AuctioneerMongoRepository],
    },
    {
      provide: 'BidderRepository',
      useFactory: (mongoRepository: BidderMongoRepository) => mongoRepository,
      inject: [BidderMongoRepository],
    },
    {
      provide: 'BidRepository',
      useFactory: (mongoRepository: BidMongoRepository) => mongoRepository,
      inject: [BidMongoRepository],
    },
    {
      provide: 'BidderNotificationRepository',
      useFactory: (mongoRepository: BidderNotificationMongoRepository) => mongoRepository,
      inject: [BidderNotificationMongoRepository],
    },
    {
      provide: 'OrderRepository',
      useFactory: (mongoRepository: OrderMongoRepository) => mongoRepository,
      inject: [OrderMongoRepository],
    },
    {
      provide: SqsHelper,
      useFactory: (
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
      useFactory: (
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
      useFactory: (
        logger: LoggerInterface,
        sqsPublisher: SqsPublisher,
      ) => new SmsSqsPublisher(logger, sqsPublisher),
      inject: ['LoggerInterface', 'SqsPublisher'],
    },
    {
      provide: 'ORDER_QUEUE',
      useFactory: (
        sqsPublisher: SqsPublisher,
      ) => new OrderSqsPublisher(sqsPublisher),
      inject: ['SqsPublisher'],
    },
    {
      provide: EmailNotificationQueueStrategy,
      useFactory: (
        emailQueue: QueueMessagePublisher,
      ) => new EmailNotificationQueueStrategy(emailQueue),
      inject: ['EMAIL_QUEUE'],
    },
    {
      provide: SmsNotificationQueueStrategy,
      useFactory: (
        smsQueue: QueueMessagePublisher,
      ) => new SmsNotificationQueueStrategy(smsQueue),
      inject: ['SMS_QUEUE'],
    },
    {
      provide: 'SqsConsumerInterface',
      useFactory: (
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
        auctionRepository: AuctionRepository,
        config: EnvironmentConfigInterface,
      ) => new SendEmailToWinnerUseCase(
        logger,
        emailSender,
        bidderRepository,
        bidderNotificationRepository,
        auctionRepository,
        config.getDefaultSenderEmail(),
      ),
      inject: ['LoggerInterface', 'EmailSender', 'BidderRepository', 'BidderNotificationRepository', 'AuctionRepository', 'EnvironmentConfigInterface'],
    },
    {
      provide: SendPaymentRequestEmailToWinnerUseCase,
      useFactory: (
        logger: LoggerInterface,
        emailSender: EmailSender,
        bidderRepository: BidderRepository,
        bidderNotificationRepository: BidderNotificationRepository,
        auctionRepository: AuctionRepository,
        orderRepository: OrderRepository,
        config: EnvironmentConfigInterface,
      ) => new SendPaymentRequestEmailToWinnerUseCase(
        logger,
        emailSender,
        bidderRepository,
        bidderNotificationRepository,
        auctionRepository,
        orderRepository,
        config.getDefaultSenderEmail(),
      ),
      inject: ['LoggerInterface', 'EmailSender', 'BidderRepository', 'BidderNotificationRepository', 'AuctionRepository', 'OrderRepository', 'EnvironmentConfigInterface'],
    },
    {
      provide: EmailNotificationHandler,
      useFactory: (
        sendEmailToWinnerUseCase: SendEmailToWinnerUseCase,
        sendPaymentRequestEmailToWinnerUseCase: SendPaymentRequestEmailToWinnerUseCase,
      ) => new EmailNotificationHandler(
        sendEmailToWinnerUseCase,
        sendPaymentRequestEmailToWinnerUseCase,
      ),
      inject: [SendEmailToWinnerUseCase, SendPaymentRequestEmailToWinnerUseCase],
    },
    {
      provide: EmailNotificationSqsQueueConsumer,
      useFactory: (
        sqsConsumer: SqsConsumerInterface,
        emailNotificationHandler: EmailNotificationHandler,
        errorLogger: ErrorLogger,
      ) => new EmailNotificationSqsQueueConsumer(
        sqsConsumer,
        emailNotificationHandler,
        errorLogger,
      ),
      inject: ['SqsConsumerInterface', EmailNotificationHandler, ErrorLogger],
    },
    {
      provide: TriggerOrderCreationHandler,
      useFactory: (
        logger: LoggerInterface,
        orderQueue: QueueMessagePublisher,
      ) => new TriggerOrderCreationHandler(logger, orderQueue),
      inject: ['LoggerInterface', 'ORDER_QUEUE'],
    },
    {
      provide: CreateFirstAuctionOrderUseCase,
      useFactory: (
        logger: LoggerInterface,
        auctionRepository: AuctionRepository,
        orderRepository: OrderRepository,
        notificationFactory: NotificationStrategyFactory,
      ) => new CreateFirstAuctionOrderUseCase(
        logger,
        auctionRepository,
        orderRepository,
        notificationFactory,
      ),
      inject: ['LoggerInterface', 'AuctionRepository', 'OrderRepository', NotificationStrategyFactory],
    },
    {
      provide: OrderQueueHandler,
      useFactory: (
        createFirstOrderUseCase: CreateFirstAuctionOrderUseCase,
      ) => new OrderQueueHandler(
        createFirstOrderUseCase,
      ),
      inject: [CreateFirstAuctionOrderUseCase],
    },
    {
      provide: OrderSqsQueueConsumer,
      useFactory: (
        sqsConsumer: SqsConsumerInterface,
        errorLogger: ErrorLogger,
        orderQueueHandler: OrderQueueHandler,
      ) => new OrderSqsQueueConsumer(
        sqsConsumer,
        errorLogger,
        orderQueueHandler,
      ),
      inject: ['SqsConsumerInterface', ErrorLogger, OrderQueueHandler],
    },
    {
      provide: NotificationStrategyFactory,
      useFactory: (
        emailStrategy: EmailNotificationQueueStrategy,
        smsStrategy: SmsNotificationQueueStrategy,
      ) => new NotificationStrategyFactory(emailStrategy, smsStrategy),
      inject: [EmailNotificationQueueStrategy, SmsNotificationQueueStrategy],
    },
    {
      provide: NotifyWinningBidderHandler,
      useFactory: (
        strategyFactory: NotificationStrategyFactory,
      ) => {
        const result = new NotifyWinningBidderHandler(strategyFactory);
        return result;
      },
      inject: [NotificationStrategyFactory],
    },
    {
      provide: DomainEventManagerFactory,
      useFactory: (
        logger: LoggerInterface,
        notifyWinningBidder: NotifyWinningBidderHandler,
        createOrderHandler: TriggerOrderCreationHandler,
      ) => new DomainEventManagerFactory(logger, [
        {
          event: DomainEventType.BID_PERIOD_FINISHED,
          handlers: [notifyWinningBidder, createOrderHandler],
        },
      ]),
      inject: ['LoggerInterface', NotifyWinningBidderHandler, TriggerOrderCreationHandler],
    },
    {
      provide: 'DomainEventManagerInterface',
      useFactory: (factory: DomainEventManagerFactory) => factory.getInstance(),
      inject: [DomainEventManagerFactory],
    },
    {
      provide: 'EventPublisher',
      useFactory: (eventManager: DomainEventManagerInterface) => eventManager,
      inject: ['DomainEventManagerInterface'],
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
