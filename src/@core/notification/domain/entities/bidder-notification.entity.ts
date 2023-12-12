import Entity from '../../../common/domain/entity';
import IsoStringDate from '../../../common/domain/value-objects/iso-string-data.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { NotificationChannel, NotificationType } from '../../application/service/notification-type';

export type BidderNotificationConstructorProps = {
  bidderId: string;
  channel: NotificationChannel;
  type: NotificationType;
  auctionId: string | null;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
};

// aply object values
export default class BidderNotification extends Entity {
  private readonly bidderId: Uuid;

  private readonly channel: NotificationChannel;

  private readonly type: NotificationType;

  private readonly auctionId: Uuid | null;

  private readonly sentAt: IsoStringDate;

  private readonly createdAt: IsoStringDate;

  private readonly updatedAt: IsoStringDate;

  constructor(params: BidderNotificationConstructorProps) {
    super();
    this.bidderId = new Uuid(params.bidderId);
    this.channel = params.channel;
    this.type = params.type;
    this.auctionId = params.auctionId ? new Uuid(params.auctionId) : null;
    this.sentAt = new IsoStringDate(params.sentAt);
    this.createdAt = new IsoStringDate(params.createdAt);
    this.updatedAt = new IsoStringDate(params.updatedAt);
  }

  static create(params: {
    bidderId: string;
    channel: NotificationChannel;
    type: NotificationType;
    auctionId?: string;
  }): BidderNotification {
    return new BidderNotification({
      bidderId: params.bidderId,
      channel: params.channel,
      type: params.type,
      auctionId: params.auctionId,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  getId(): string {
    return this.bidderId.value;
  }

  toJSON() {
    return {
      bidderId: this.bidderId.value,
      channel: this.channel,
      type: this.type,
      auctionId: this.auctionId.value,
      sentAt: this.sentAt.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
