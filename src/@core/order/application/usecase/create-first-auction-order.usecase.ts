import { AuctionRepository } from '../../../auction/domain/repositories/auction.repository';
import AuctionNotFoundError from '../../../auction/error/auction-not-found';
import { LoggerInterface } from '../../../common/application/service/logger';
import NotificationStrategyFactory from '../../../notification/application/service/notification-strategy.factory';
import { NotificationChannel, NotificationType } from '../../../notification/application/service/notification-type';
import Order from '../../domain/entities/order.entity';
import OrderRepository from '../../domain/repositories/order.repository';
import { PaymentResponsibilityEnum } from '../../domain/value-objects/payment-responsibility.vo';

interface InputDto {
  auctionId: string;
}

export default class CreateFirstAuctionOrderUseCase {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly auctionRepository: AuctionRepository,
    private readonly orderRepository: OrderRepository,
    private readonly notificationFactory: NotificationStrategyFactory,
  ) { }

  async execute(input: InputDto): Promise<void> {
    const { auctionId } = input;
    this.logger.info(`Starting to create order for auctionId: (${auctionId})`);

    const auction = await this.auctionRepository.findById(auctionId);

    if (!auction) {
      throw new AuctionNotFoundError({ auctionId });
    }

    const highestBid = auction.getHighestBid();

    if (!highestBid) {
      this.logger.info(`Skipping order creation for auctionId: (${auctionId}) because there are no bids`);
      return;
    }

    const order = Order.create({
      auctionId,
      bidderId: highestBid.getBidderId(),
      auctionFinalValue: highestBid.getPrice(),
      paymentResponsibility: PaymentResponsibilityEnum.SYSTEM,
    });

    await this.orderRepository.create(order);
    await this.triggerPaymentNotificationToBidder({
      orderId: order.getId(),
    });

    this.logger.info(`Finished creating order for auctionId: (${auctionId}) with orderId: (${order.getId()})`);
  }

  private async triggerPaymentNotificationToBidder(params: {
    orderId: string;
  }): Promise<void> {
    const channels = [
      NotificationChannel.EMAIL,
      NotificationChannel.SMS,
    ];

    const promises = channels.map((channel) => {
      const strategy = this.notificationFactory.getStrategy(channel);
      return strategy.execute(NotificationType.NOTIFY_BIDDER_ABOUT_PAYMENT, {
        orderId: params.orderId,
      });
    });

    await Promise.all(promises);
  }
}
