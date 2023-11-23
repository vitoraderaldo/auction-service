import { connect, Mongoose } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuctionModel, AuctionSchema } from '../schemas/auction.schema';
import { AuctionMongoRepository } from './auction-mongo.repository';
import {
  Auction,
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
    await repository.save(auction);

    const savedAuction = await model.findOne({ id: auction.id.value });
    expect(savedAuction.id).toBe(auction.id.value);
    expect(savedAuction.title).toBe(auction.title);
    expect(savedAuction.description).toBe(auction.description);
    expect(savedAuction.photos).toEqual([]);
    expect(savedAuction.startDate).toBe(auction.startDate.value);
    expect(savedAuction.endDate).toBe(auction.endDate.value);
    expect(savedAuction.startPrice).toBe(auction.startPrice.value);
    expect(savedAuction.currentPrice).toBe(null);
    expect(savedAuction.status).toBe(auction.status.value);
    expect(savedAuction.auctioneerId).toBe(auction.auctioneerId);
    expect(savedAuction.createdAt).toBeInstanceOf(Date);
    expect(savedAuction.updatedAt).toBeInstanceOf(Date);
  });
});
