import EmailSender, { AllKindOfEmailData, RequestBidderPaymentOnAuctionEmailData, WinningBidderEmailData } from '../../../application/service/email/email.types';
import { NotificationType } from '../../../application/service/notification-type';
import InvalidNotificationTypeError from '../../../error/invalid-notification-type';
import NotifyWinningBidderSendGrid from './cases/notify-winning-bidder';
import SendPaymentRequestToWinnerSendGrid from './cases/send-payment-request-to-winner';

export default class SendGridService implements EmailSender {
  constructor(
    private readonly notifyWinningBidder: NotifyWinningBidderSendGrid,
    private readonly sendPaymentRequestToWinnerSendGrid: SendPaymentRequestToWinnerSendGrid,
  ) {}

  send(data: AllKindOfEmailData): Promise<void> {
    switch (data.type) {
      case NotificationType.NOTIFY_WINNING_BIDDER:
        return this.notifyWinningBidder.send(data as WinningBidderEmailData);
      case NotificationType.NOTIFY_BIDDER_ABOUT_PAYMENT:
        return this.sendPaymentRequestToWinnerSendGrid.send(
          data as RequestBidderPaymentOnAuctionEmailData,
        );
      default:
        throw new InvalidNotificationTypeError({ message: data });
    }
  }
}
