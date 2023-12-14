import { BidPeriodFinishedEventPayload } from '../../../auction/domain/domain-events/bid-period-finished';
import InvalidNotificationTypeError from '../../error/invalid-notification-type';
import { NotificationType } from '../service/notification-type';
import SendEmailToWinnerUseCase from '../usecase/send-email-to-winner.usecase';

export default class EmailNotificationHandler {
  constructor(
    private readonly sendEmailToWinnerUseCase: SendEmailToWinnerUseCase,
  ) {}

  async handle(message: {
    type: NotificationType,
    payload: any,
  }): Promise<void> {
    switch (message?.type) {
      case NotificationType.NOTIFY_WINNING_BIDDER:
        await this.sendEmailToWinner(message.payload);
        break;
      default:
        throw new InvalidNotificationTypeError({ message });
    }
  }

  private sendEmailToWinner(payload: any): Promise<void> {
    const data = payload as BidPeriodFinishedEventPayload;
    return this.sendEmailToWinnerUseCase.execute({
      auctionId: data.auctionId,
    });
  }
}
