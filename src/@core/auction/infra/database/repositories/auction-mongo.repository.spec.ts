import { connect, Mongoose } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import AuctionSchema, { AuctionModel, AuctionMongoInterface } from '../schemas/auction.schema';
import AuctionMongoRepository from './auction-mongo.repository';
import Auction, {
  AuctionCreateProps,
} from '../../../domain/entities/auction.entity';

describe('AuctionMongoRepository', () => {
  let mongoServer: MongoMemoryServer;
  let connection: Mongoose;
  let model: AuctionModel;
  let repository: AuctionMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      mongoServer = await MongoMemoryServer.create();
      connection = await connect(mongoServer.getUri());
    }

    model = AuctionSchema.getModel(connection);
    repository = new AuctionMongoRepository(model);
    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
    mongoServer.stop();
  });

  it('should save an auction on the database', async () => {
    const startDate = new Date();
    startDate.setUTCHours(startDate.getUTCHours() + 1);

    const endDate = new Date();
    endDate.setUTCDate(endDate.getUTCDate() + 15);

    const createProps: AuctionCreateProps = {
      title: 'New Auction',
      description: 'New auction description',
      photos: [],
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startPrice: 50.8,
      auctioneerId: 'auctioneer-id',
    };

    const auction = Auction.create(createProps);
    const auctionData = auction.toJSON();
    await repository.save(auction);

    const savedAuction = await model.findOne<AuctionMongoInterface>({ id: auction.getId() });

    expect(savedAuction.id).toBe(auctionData.id);
    expect(savedAuction.title).toBe(auctionData.title);
    expect(savedAuction.description).toBe(auctionData.description);
    expect(savedAuction.photos).toEqual([]);
    expect(savedAuction.startDate).toBe(auctionData.startDate);
    expect(savedAuction.endDate).toBe(auctionData.endDate);
    expect(savedAuction.startPrice).toBe(auctionData.startPrice);
    expect(savedAuction.currentPrice).toBe(null);
    expect(savedAuction.status).toBe(auctionData.status);
    expect(savedAuction.auctioneerId).toBe(auctionData.auctioneerId);
    expect(savedAuction.createdAt).toBeInstanceOf(Date);
    expect(savedAuction.updatedAt).toBeInstanceOf(Date);
  });
});
