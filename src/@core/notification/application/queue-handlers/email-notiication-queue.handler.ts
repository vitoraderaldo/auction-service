import { BidPeriodFinishedEventPayload } from '../../../auction/domain/domain-events/bid-period-finished';
import InvalidNotificationTypeError from '../../error/invalid-notification-type';
import { NotificationType } from '../service/notification-type';
import SendEmailToWinnerUseCase from '../usecase/send-email-to-winner.usecase';
import SendPaymentRequestEmailToWinnerUseCase from '../usecase/send-payment-request-email-to-winner.usecase';

export default class EmailNotificationHandler {
  constructor(
    private readonly sendEmailToWinnerUseCase: SendEmailToWinnerUseCase,
    private readonly sendPaymentRequestEmailToWinnerUseCase: SendPaymentRequestEmailToWinnerUseCase,
  ) {}

  async handle(message: {
    type: NotificationType,
    payload: any,
  }): Promise<void> {
    switch (message?.type) {
      case NotificationType.NOTIFY_WINNING_BIDDER:
        await this.sendEmailToAuctionWinner(message.payload);
        break;
      case NotificationType.NOTIFY_BIDDER_ABOUT_PAYMENT:
        await this.sendPaymentRequestEmailToAuctionWinner(message.payload);
        break;
      default:
        throw new InvalidNotificationTypeError({ message });
    }
  }

  private sendEmailToAuctionWinner(payload: any): Promise<void> {
    const data = payload as BidPeriodFinishedEventPayload;
    return this.sendEmailToWinnerUseCase.execute({
      auctionId: data.auctionId,
    });
  }

  private sendPaymentRequestEmailToAuctionWinner(payload: {
    orderId: string;
  }): Promise<void> {
    return this.sendPaymentRequestEmailToWinnerUseCase.execute({
      orderId: payload.orderId,
    });
  }
}
