import EmailSender, { AllKindOfEmailData, WinningBidderEmailData } from '../../../application/service/email/email.types';
import { NotificationType } from '../../../application/service/notification-type';
import NotifyWinningBidderSendGrid from './cases/notify-winning-bidder';

export default class SendGridService implements EmailSender {
  constructor(
    private readonly notifyWinningBidder: NotifyWinningBidderSendGrid,
  ) {}

  send(data: AllKindOfEmailData): Promise<void> {
    switch (data.type) {
      case NotificationType.NOTIFY_WINNING_BIDDER:
        return this.notifyWinningBidder.send(data as WinningBidderEmailData);
      default:
        return Promise.resolve();
    }
  }
}
