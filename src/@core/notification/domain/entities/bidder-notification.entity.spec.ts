import { faker } from '@faker-js/faker';
import { NotificationChannel, NotificationType } from '../../application/service/notification-type';
import BidderNotification, { BidderNotificationConstructorProps } from './bidder-notification.entity';

describe('BidderNotification', () => {
  const validConstructorParams: BidderNotificationConstructorProps = {
    bidderId: faker.string.uuid(),
    channel: NotificationChannel.EMAIL,
    type: NotificationType.NOTIFY_WINNING_BIDDER,
    auctionId: faker.string.uuid(),
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should create an instance of BidderNotification with valid constructor params', () => {
    const bidderNotification = new BidderNotification(validConstructorParams);

    expect(bidderNotification).toBeInstanceOf(BidderNotification);
    expect(bidderNotification.toJSON()).toEqual({
      bidderId: validConstructorParams.bidderId,
      channel: validConstructorParams.channel,
      type: validConstructorParams.type,
      auctionId: validConstructorParams.auctionId,
      sentAt: validConstructorParams.sentAt,
      createdAt: validConstructorParams.createdAt,
      updatedAt: validConstructorParams.updatedAt,
    });
  });

  it('should create an instance of BidderNotification using the create static method', () => {
    const createParams = {
      auctionId: faker.string.uuid(),
      bidderId: faker.string.uuid(),
      channel: NotificationChannel.EMAIL,
      type: NotificationType.NOTIFY_WINNING_BIDDER,
    };

    const bidderNotification = BidderNotification.create(createParams);
    const data = bidderNotification.toJSON();

    expect(bidderNotification).toBeInstanceOf(BidderNotification);
    expect(data.auctionId).toEqual(createParams.auctionId);
    expect(data.bidderId).toEqual(createParams.bidderId);
    expect(data.channel).toEqual(createParams.channel);
    expect(data.type).toEqual(createParams.type);
    expect(data.sentAt).toBeDefined();
    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
  });
});
