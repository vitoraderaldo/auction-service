import { AuctionRepository } from '../../../auction/domain/repositories/auction.repository';
import BidRepository from '../../../auction/domain/repositories/bid.repository';
import BidderRepository from '../../../auction/domain/repositories/bidder.repository';
import { LoggerInterface } from '../../../common/application/service/logger';
import AuctionNotFoundError from '../../../common/error/auction-not-found';
import BidNotFoundError from '../../../common/error/bid-not-found';
import BidderNotFoundError from '../../../common/error/bidder-not-found';
import BidderNotification from '../../domain/entities/bidder-notification.entity';
import BidderNotificationRepository from '../../domain/repositories/bidder-notification.repository';
import EmailSender, { WinningBidderEmailData } from '../service/email/email.types';
import { NotificationChannel, NotificationType } from '../service/notification-type';

interface InputDTO {
  winningBidId: string;
}

export default class SendEmailToWinnerUseCase {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly emailSender: EmailSender,
    private readonly bidderRepository: BidderRepository,
    private readonly bidderNotificationRepository: BidderNotificationRepository,
    private readonly bidRepository: BidRepository,
    private readonly auctionRepository: AuctionRepository,
    private readonly fromEmailAdress: string,
  ) {}

  async execute(input: InputDTO): Promise<void> {
    const { winningBidId } = input;

    if (!winningBidId) {
      this.logger.info('Skipping email notification because the winningBidId is not provided', input);
      return;
    }

    const bid = await this.bidRepository
      .findById(winningBidId)
      .then((value) => value?.toJSON());

    if (!bid) {
      throw new BidNotFoundError({ bidId: winningBidId });
    }

    const bidder = await this.bidderRepository
      .findById(bid.bidderId)
      .then((value) => value?.toJSON());

    if (!bidder) {
      throw new BidderNotFoundError({
        bidderId: bid.bidderId,
      });
    }

    const auction = await this.auctionRepository
      .findById(bid.auctionId)
      .then((value) => value?.toJSON());

    if (!auction) {
      throw new AuctionNotFoundError({ auctionId: bid.auctionId });
    }

    const emailData: WinningBidderEmailData = {
      from: this.fromEmailAdress,
      to: bidder.email,
      type: NotificationType.NOTIFY_WINNING_BIDDER,
      metadata: {
        bidder,
        bid: {
          value: bid.value,
          date: bid.createdAt,
        },
        auction,
      },
    };

    const notification = BidderNotification.create({
      bidderId: bid.bidderId,
      channel: NotificationChannel.EMAIL,
      type: NotificationType.NOTIFY_WINNING_BIDDER,
      auctionId: bid.auctionId,
    });

    await this.emailSender.send(emailData);
    await this.bidderNotificationRepository
      .save(notification)
      .catch((error) => {
        this.logger.error(`Failed to save notification for bidderId: (${bid.bidderId}) of auctionId: (${bid.auctionId})`, error);
      });

    this.logger.info(`Finished to send email to bidderId: (${bid.bidderId}) of auctionId: (${bid.auctionId})`);
  }
}
