import { connect, Mongoose } from 'mongoose';
import { randomUUID } from 'crypto';
import BidSchema, {
  BidModel,
  BidMongoInterface,
} from '../schemas/bid.schema';
import BidMongoRepository from './bid-mongo.repository';
import buildBid from '../../../../../../test/util/bid.mock';

describe('BidMongoRepository', () => {
  let connection: Mongoose;
  let model: BidModel;
  let repository: BidMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      connection = await connect(process.env.MONGO_URI, { dbName: randomUUID() });
    }

    model = BidSchema.getModel(connection);
    repository = new BidMongoRepository(model);
    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('should save a bid on the database', async () => {
    const bid = buildBid();
    await repository.save(bid);

    const savedBid = await model.findOne<BidMongoInterface>({
      id: bid.getId(),
    });

    const bidData = bid.toJSON();

    expect(savedBid.id).toEqual(bidData.id);
    expect(savedBid.auctionId).toEqual(bidData.auctionId);
    expect(savedBid.bidderId).toEqual(bidData.bidderId);
    expect(savedBid.value).toEqual(bidData.value);
    expect(savedBid.createdAt).toBeInstanceOf(Date);
    expect(savedBid.updatedAt).toBeInstanceOf(Date);
  });
});
