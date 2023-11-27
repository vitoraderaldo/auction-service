import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { connect, Mongoose } from 'mongoose';
import BidderSchema, {
  BidderModel,
  BidderMongoInterface,
} from '../schemas/bidder.schema';
import BidderMongoRepository from './bidder-mongo.repository';
import Bidder from '../../../domain/entities/bidder.entity';
import buildBidder from '../../../../../../test/util/bidder.mock';
import Uuid from '../../../../common/domain/value-objects/uuid.vo';

describe('BidderMongoRepository', () => {
  let connection: Mongoose;
  let model: BidderModel;
  let repository: BidderMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      connection = await connect(process.env.MONGO_URI, { dbName: randomUUID() });
    }

    model = BidderSchema.getModel(connection);
    repository = new BidderMongoRepository(model);
    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('should save an bidder on the database', async () => {
    const bidder = buildBidder();
    await repository.save(bidder);

    const savedBidder = await model.findOne<BidderMongoInterface>({
      id: bidder.getId(),
    });

    const bidderData = bidder.toJSON();

    expect(savedBidder.id).toEqual(bidderData.id);
    expect(savedBidder.email).toEqual(bidderData.email);
    expect(savedBidder.firstName).toEqual(bidderData.firstName);
    expect(savedBidder.lastName).toEqual(bidderData.lastName);
    expect(savedBidder.createdAt).toBeInstanceOf(Date);
    expect(savedBidder.updatedAt).toBeInstanceOf(Date);
  });

  it('should find an bidder by id as UUID', async () => {
    const id = new Uuid(randomUUID());
    const bidder = buildBidder({ id });
    await repository.save(bidder);

    const foundBidder = await repository.findById(id);

    const bidderData = bidder.toJSON();
    const databaseData = foundBidder.toJSON();

    expect(foundBidder).toBeInstanceOf(Bidder);
    expect(databaseData.id).toEqual(bidderData.id);
    expect(databaseData.email).toEqual(bidderData.email);
    expect(databaseData.firstName).toEqual(bidderData.firstName);
    expect(databaseData.lastName).toEqual(bidderData.lastName);
    expect(databaseData.createdAt).toBeTruthy();
    expect(databaseData.updatedAt).toBeTruthy();
  });

  it('should find an bidder by id as string', async () => {
    const id = randomUUID().toString();
    const bidder = buildBidder({ id: new Uuid(id) });
    await repository.save(bidder);

    const foundBidder = await repository.findById(id);

    const bidderData = bidder.toJSON();
    const databaseData = foundBidder.toJSON();

    expect(foundBidder).toBeInstanceOf(Bidder);
    expect(databaseData.id).toEqual(bidderData.id);
    expect(databaseData.email).toEqual(bidderData.email);
    expect(databaseData.firstName).toEqual(bidderData.firstName);
    expect(databaseData.lastName).toEqual(bidderData.lastName);
    expect(databaseData.createdAt).toBeTruthy();
    expect(databaseData.updatedAt).toBeTruthy();
  });

  it('should return null if no bidder is found by ID', async () => {
    await repository.save(buildBidder());
    const foundBidder = await repository.findById(randomUUID());

    expect(foundBidder).toBeNull();
  });

  it('should find an bidder by email', async () => {
    const email = faker.internet.email();
    const bidder = buildBidder({ email });
    await repository.save(bidder);

    const foundBidder = await repository.findByEmail(email);

    const bidderData = bidder.toJSON();
    const databaseData = foundBidder.toJSON();

    expect(foundBidder).toBeInstanceOf(Bidder);
    expect(databaseData.id).toEqual(bidderData.id);
    expect(databaseData.email).toEqual(bidderData.email);
    expect(databaseData.firstName).toEqual(bidderData.firstName);
    expect(databaseData.lastName).toEqual(bidderData.lastName);
    expect(databaseData.createdAt).toBeTruthy();
    expect(databaseData.updatedAt).toBeTruthy();
  });

  it('should return null if no bidder is found by email', async () => {
    await repository.save(buildBidder());
    const foundBidder = await repository.findByEmail(faker.internet.email());

    expect(foundBidder).toBeNull();
  });
});
