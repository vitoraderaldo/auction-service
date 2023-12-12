import BidderNotification from '../../../domain/entities/bidder-notification.entity';
import BidderNotificationRepository from '../../../domain/repositories/bidder-notification.repository';
import BidderNotificationSchema, { BidderNotificationModel } from '../schemas/bidder-notification.schema';

export default class BidderNotificationMongoRepository implements BidderNotificationRepository {
  constructor(
    private readonly model: BidderNotificationModel,
  ) {}

  async save(bidderNotification: BidderNotification): Promise<void> {
    const document = BidderNotificationSchema.toDatabase(bidderNotification);
    await this.model.create(document);
  }
}
