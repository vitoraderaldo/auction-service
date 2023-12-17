import { AuctionRepository } from '../../../auction/domain/repositories/auction.repository';
import BidderRepository from '../../../auction/domain/repositories/bidder.repository';
import { LoggerInterface } from '../../../common/application/service/logger';
import AuctionNotFoundError from '../../../auction/error/auction-not-found';
import BidderNotFoundError from '../../../auction/error/bidder-not-found';
import BidderNotification from '../../domain/entities/bidder-notification.entity';
import BidderNotificationRepository from '../../domain/repositories/bidder-notification.repository';
import EmailSender, { WinningBidderEmailData } from '../service/email/email.types';
import { NotificationChannel, NotificationType } from '../service/notification-type';

interface InputDTO {
  auctionId: string;
}

export default class SendEmailToWinnerUseCase {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly emailSender: EmailSender,
    private readonly bidderRepository: BidderRepository,
    private readonly bidderNotificationRepository: BidderNotificationRepository,
    private readonly auctionRepository: AuctionRepository,
    private readonly fromEmailAdress: string,
  ) {}

  async execute(input: InputDTO): Promise<void> {
    const { auctionId } = input;

    if (!auctionId) {
      throw new AuctionNotFoundError({ auctionId });
    }

    const auction = await this.auctionRepository.findById(auctionId);

    if (!auction) {
      throw new AuctionNotFoundError({ auctionId });
    }

    const highestBid = auction.getHighestBid();

    if (!highestBid) {
      this.logger.info(`Skipping email notification because there is no winner for auctionId: (${auctionId})`);
      return;
    }

    const bidderId = highestBid.getBidderId();

    const bidder = await this.bidderRepository
      .findById(bidderId)
      .then((value) => value?.toJSON());

    if (!bidder) {
      throw new BidderNotFoundError({
        bidderId,
      });
    }

    const notificationType = NotificationType.NOTIFY_WINNING_BIDDER;

    const emailData: WinningBidderEmailData = {
      from: this.fromEmailAdress,
      to: bidder.email,
      type: notificationType,
      metadata: {
        bidder,
        bid: {
          value: highestBid.getPrice().value,
          date: highestBid.getCreatedAt(),
        },
        auction: auction.toJSON(),
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
