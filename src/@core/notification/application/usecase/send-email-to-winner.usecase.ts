import { AuctionRepository } from '../../../auction/domain/repositories/auction.repository';
import BidRepository from '../../../auction/domain/repositories/bid.repository';
import BidderRepository from '../../../auction/domain/repositories/bidder.repository';
import { LoggerInterface } from '../../../common/application/service/logger';
import { BidPeriodFinishedEventPayload } from '../../../common/domain/domain-events/bid-period-finished';
import AuctionNotFoundError from '../../../common/error/auction-not-found';
import BidNotFoundError from '../../../common/error/bid-not-found';
import BidderNotFoundError from '../../../common/error/bidder-not-found';
import BidderNotification from '../../domain/entities/bidder-notification.entity';
import BidderNotificationRepository from '../../domain/repositories/bidder-notification.repository';
import EmailSubject from '../service/email/email-subjects';
import EmailSender, { WinningBidderEmailData } from '../service/email/email.types';
import { NotificationChannel, NotificationType } from '../service/notification-type';

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

  async execute(input: BidPeriodFinishedEventPayload): Promise<void> {
    const { winnerBidderId, winningBidId, auctionId } = input;
    this.logger.info(`Starting to send email to bidderId: (${winnerBidderId}) of auctionId: (${auctionId})`);

    if (!winnerBidderId || !winningBidId) {
      this.logger.info(`Skipping email notification because there is no winner bidder for auctionId: (${auctionId})`);
      return;
    }

    const bidder = await this.bidderRepository
      .findById(winnerBidderId)
      .then((value) => value.toJSON());

    if (!bidder) {
      throw new BidderNotFoundError({
        bidderId: winnerBidderId,
      });
    }

    const auction = await this.auctionRepository
      .findById(auctionId)
      .then((value) => value.toJSON());

    if (!auction) {
      throw new AuctionNotFoundError({ auctionId });
    }

    const bid = await this.bidRepository
      .findById(winningBidId)
      .then((value) => value?.toJSON());

    if (!bid) {
      throw new BidNotFoundError({ bidId: winningBidId });
    }

    const emailData: WinningBidderEmailData = {
      from: this.fromEmailAdress,
      to: bidder.email,
      subject: EmailSubject.NOTIFY_WINNING_BIDDER,
      type: NotificationType.NOTIFY_WINNING_BIDDER,
      data: {
        bidder,
        bid: {
          value: bid.value,
          date: bid.createdAt,
        },
        auction,
      },
    };

    const notification = BidderNotification.create({
      bidderId: winnerBidderId,
      channel: NotificationChannel.EMAIL,
      type: NotificationType.NOTIFY_WINNING_BIDDER,
      auctionId,
    });

    await this.emailSender.send(emailData);
    await this.bidderNotificationRepository
      .save(notification)
      .catch((error) => {
        this.logger.error(`Failed to save notification for bidderId: (${winnerBidderId}) of auctionId: (${auctionId})`, error);
      });

    this.logger.info(`Finished to send email to bidderId: (${winnerBidderId}) of auctionId: (${auctionId})`);
  }
}
