import { connect, Mongoose } from 'mongoose';
import { randomUUID } from 'crypto';
import BidderNotificationSchema, {
  BidderNotificationModel,
  BidderNotificationMongoInterface,
} from '../schemas/bidder-notification.schema';
import BidderNotificationMongoRepository from './bidder-notification-mongo.repository';
import buildbidderNotification from '../../../../../../../test/util/bidderNotification.mock';

describe('BidderNotificationMongoRepository', () => {
  let connection: Mongoose;
  let model: BidderNotificationModel;
  let repository: BidderNotificationMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      connection = await connect(process.env.MONGO_URI, { dbName: randomUUID() });
    }

    model = BidderNotificationSchema.getModel(connection);
    repository = new BidderNotificationMongoRepository(model);
    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('should save a BidderNotification to the database', async () => {
    const bidderNotification = buildbidderNotification();
    await repository.save(bidderNotification);

    const savedBidderNotification = await model.findOne<BidderNotificationMongoInterface>({
      bidderId: bidderNotification.getId(),
    }).exec();

    const bidderNotificationData = bidderNotification.toJSON();

    expect(savedBidderNotification.bidderId).toEqual(bidderNotificationData.bidderId);
    expect(savedBidderNotification.channel).toEqual(bidderNotificationData.channel);
    expect(savedBidderNotification.type).toEqual(bidderNotificationData.type);
    expect(savedBidderNotification.auctionId).toEqual(bidderNotificationData.auctionId);
    expect(savedBidderNotification.sentAt).toEqual(bidderNotificationData.sentAt);
    expect(savedBidderNotification.createdAt).toBeInstanceOf(Date);
    expect(savedBidderNotification.updatedAt).toBeInstanceOf(Date);
  });
});
