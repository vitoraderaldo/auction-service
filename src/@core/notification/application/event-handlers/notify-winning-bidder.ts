import DomainEventHandler from '../../../common/application/event-handler/event-handler';
import BidPeriodFinishedEvent from '../../../common/domain/domain-events/bid-period-finished';
import NotificationStrategyFactory from '../service/notification-strategy.factory';
import { NotificationChannel, NotificationType } from '../service/notification-type';

export default class NotifyWinningBidderHandler implements DomainEventHandler {
  constructor(
    private readonly notificationFactory: NotificationStrategyFactory,
  ) {}

  async handle(event: BidPeriodFinishedEvent): Promise<void> {
    const emailStrategy = this.notificationFactory.getStrategy(NotificationChannel.EMAIL);
    await emailStrategy.execute(NotificationType.NOTIFY_WINNING_BIDDER, event.payload);

    const smsStrategy = this.notificationFactory.getStrategy(NotificationChannel.SMS);
    await smsStrategy.execute(NotificationType.NOTIFY_WINNING_BIDDER, event.payload);
  }
}
