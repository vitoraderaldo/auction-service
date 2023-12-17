import { connect, Mongoose } from 'mongoose';
import { faker } from '@faker-js/faker';
import BidSchema, {
  BidModel,
  BidMongoInterface,
} from '../schemas/bid.schema';
import BidMongoRepository from './bid-mongo.repository';
import buildBid from '../../../../../../../test/util/bid.mock';

describe('BidMongoRepository', () => {
  let connection: Mongoose;
  let model: BidModel;
  let repository: BidMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      connection = await connect(process.env.MONGO_URI, { dbName: faker.string.uuid() });
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
    await repository.create(bid);

    const savedBid = await model.findOne<BidMongoInterface>({
      id: bid.getId(),
    }).exec();

    const bidData = bid.toJSON();

    expect(savedBid.id).toEqual(bidData.id);
    expect(savedBid.auctionId).toEqual(bidData.auctionId);
    expect(savedBid.bidderId).toEqual(bidData.bidderId);
    expect(savedBid.value).toEqual(bidData.value);
    expect(savedBid.createdAt).toBeInstanceOf(Date);
    expect(savedBid.updatedAt).toBeInstanceOf(Date);
  });

  it('should find a bid by id', async () => {
    const bid = buildBid();
    await repository.create(bid);

    const foundBid = await model.findOne<BidMongoInterface>({
      id: bid.getId(),
    }).exec();

    expect(foundBid.id).toEqual(bid.getId());
    expect(foundBid.auctionId).toEqual(bid.getAuctionId());
    expect(foundBid.bidderId).toEqual(bid.getBidderId());
    expect(foundBid.value).toEqual(bid.getPrice().value);
    expect(foundBid.createdAt).toBeInstanceOf(Date);
    expect(foundBid.updatedAt).toBeInstanceOf(Date);
  });
});
