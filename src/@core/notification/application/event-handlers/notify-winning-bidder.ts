import BidPeriodFinishedEvent from '../../../auction/domain/domain-events/bid-period-finished';
import { DomainEventHandler } from '../../../common/domain/domain-events/domain-event';
import NotificationStrategyFactory from '../service/notification-strategy.factory';
import { NotificationChannel, NotificationType } from '../service/notification-type';

export default class NotifyWinningBidderHandler implements DomainEventHandler {
  constructor(
    private readonly notificationFactory: NotificationStrategyFactory,
  ) {}

  async handle(event: BidPeriodFinishedEvent): Promise<void> {
    const channels = [
      NotificationChannel.EMAIL,
      NotificationChannel.SMS,
    ];

    const promises = channels.map((channel) => {
      const strategy = this.notificationFactory.getStrategy(channel);
      return strategy.execute(NotificationType.NOTIFY_WINNING_BIDDER, event.payload);
    });

    await Promise.all(promises);
  }
}
