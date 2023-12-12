import BidderNotification from '../entities/bidder-notification.entity';

export default interface BidderNotificationRepository {
  save(bidderNotification: BidderNotification): Promise<void>;
}
