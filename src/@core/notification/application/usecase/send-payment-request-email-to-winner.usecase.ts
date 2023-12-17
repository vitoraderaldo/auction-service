import { AuctionRepository } from '../../../auction/domain/repositories/auction.repository';
import BidderRepository from '../../../auction/domain/repositories/bidder.repository';
import { LoggerInterface } from '../../../common/application/service/logger';
import AuctionNotFoundError from '../../../auction/error/auction-not-found';
import BidderNotFoundError from '../../../auction/error/bidder-not-found';
import BidderNotification from '../../domain/entities/bidder-notification.entity';
import BidderNotificationRepository from '../../domain/repositories/bidder-notification.repository';
import EmailSender, { RequestBidderPaymentOnAuctionEmailData } from '../service/email/email.types';
import { NotificationChannel, NotificationType } from '../service/notification-type';
import OrderNotFoundError from '../../../order/error/order-not-found';
import OrderRepository from '../../../order/domain/repositories/order.repository';

interface InputDTO {
  orderId: string;
}

export default class SendPaymentRequestEmailToWinnerUseCase {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly emailSender: EmailSender,
    private readonly bidderRepository: BidderRepository,
    private readonly bidderNotificationRepository: BidderNotificationRepository,
    private readonly auctionRepository: AuctionRepository,
    private readonly orderRepository: OrderRepository,
    private readonly fromEmailAdress: string,
  ) {}

  async execute(input: InputDTO): Promise<void> {
    const { orderId } = input;

    if (!orderId) {
      throw new OrderNotFoundError({ orderId });
    }

    const order = await this.orderRepository
      .findById(orderId)
      .then((data) => data?.toJSON());

    if (!order) {
      throw new OrderNotFoundError({ orderId });
    }

    const auction = await this.auctionRepository
      .findById(order.auctionId)
      .then((data) => data?.toJSON());

    if (!auction) {
      throw new AuctionNotFoundError({ auctionId: order.auctionId });
    }

    const { bidderId, auctionId } = order;

    const bidder = await this.bidderRepository
      .findById(bidderId)
      .then((value) => value?.toJSON());

    if (!bidder) {
      throw new BidderNotFoundError({
        bidderId,
      });
    }

    const notificationType = NotificationType.NOTIFY_BIDDER_ABOUT_PAYMENT;

    const emailData: RequestBidderPaymentOnAuctionEmailData = {
      from: this.fromEmailAdress,
      to: bidder.email,
      type: notificationType,
      metadata: {
        bidder,
        auction: {
          title: auction.title,
          description: auction.description,
        },
        order: {
          bidValue: order.auctionFinalValue,
          total: order.auctionFinalValue,
          dueDate: order.dueDate,
        },
      },
    };

    const notification = BidderNotification.create({
      bidderId,
      channel: NotificationChannel.EMAIL,
      type: notificationType,
      auctionId,
    });

    await this.emailSender.send(emailData);
    await this.bidderNotificationRepository
      .save(notification)
      .catch((error) => {
        this.logger.error(`Failed to save notification (${notificationType}) for bidderId: (${bidderId}) of auctionId: (${auctionId})`, error);
      });

    this.logger.info(`Finished to send email: (${notificationType}) to bidderId: (${bidderId}) of auctionId: (${auctionId})`);
  }
}
