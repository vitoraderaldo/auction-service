import { Schema, Model, Mongoose } from 'mongoose';
import { NotificationChannel, NotificationType } from '../../../../application/service/notification-type';
import BidderNotification from '../../../../domain/entities/bidder-notification.entity';

export interface BidderNotificationMongoInterface {
  bidderId: string;
  channel: NotificationChannel;
  type: NotificationType;
  auctionId: string | null;
  sentAt: string;
  createdAt: Date;
  updatedAt: Date;
}

const bidderNotificationSchema = new Schema(
  {
    bidderId: String,
    channel: String,
    type: String,
    auctionId: String,
    sentAt: String,
  },
  {
    timestamps: true,
  },
);

interface BidderNotificationMongoDocument extends BidderNotificationMongoInterface, Document {}
export type BidderNotificationModel = Model<BidderNotificationMongoDocument>;

export default class BidderNotificationSchema {
  static getModel(connection: Mongoose): BidderNotificationModel {
    return connection.model<BidderNotificationMongoDocument>('BidderNotification', bidderNotificationSchema);
  }

  static toDomain(document: BidderNotificationMongoInterface) {
    if (!document) return null;

    return new BidderNotification({
      bidderId: document.bidderId,
      channel: document.channel,
      type: document.type,
      auctionId: document.auctionId,
      sentAt: document.sentAt,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }

  static toDatabase(domain: BidderNotification) {
    if (!domain) return null;

    const data = domain.toJSON();

    const mongoData: Omit<BidderNotificationMongoInterface, 'createdAt' | 'updatedAt'> = {
      bidderId: data.bidderId,
      channel: data.channel,
      type: data.type,
      auctionId: data.auctionId,
      sentAt: data.sentAt,
    };

    return mongoData;
  }
}
