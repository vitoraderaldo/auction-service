import { faker } from '@faker-js/faker';
import BidderNotification, { BidderNotificationConstructorProps } from '../../src/@core/notification/domain/entities/bidder-notification.entity';
import { NotificationChannel, NotificationType } from '../../src/@core/notification/application/service/notification-type';

export default function buildbidderNotification(
  props?: Partial<BidderNotificationConstructorProps>,
): BidderNotification {
  const notification: BidderNotificationConstructorProps = {
    bidderId: faker.string.uuid(),
    channel: NotificationChannel.EMAIL,
    type: NotificationType.NOTIFY_WINNING_BIDDER,
    auctionId: faker.string.uuid(),
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...props,
  };

  return new BidderNotification(notification);
}
