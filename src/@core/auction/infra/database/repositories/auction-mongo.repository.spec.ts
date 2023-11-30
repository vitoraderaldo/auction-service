import { connect, Mongoose } from 'mongoose';
import { randomUUID } from 'crypto';
import AuctionSchema, {
  AuctionModel,
  AuctionMongoInterface,
} from '../schemas/auction.schema';
import AuctionMongoRepository from './auction-mongo.repository';
import buildAuction from '../../../../../../test/util/auction.mock';
import Uuid from '../../../../common/domain/value-objects/uuid.vo';
import { AuctionStatusEnum } from '../../../domain/value-objects/auction-status.vo';
import BidSchema, { BidModel } from '../schemas/bid.schema';
import AuctionNotFoundError from '../../../../common/error/auction-not-found';

describe('AuctionMongoRepository', () => {
  let connection: Mongoose;
  let auctionModel: AuctionModel;
  let bidModel: BidModel;
  let repository: AuctionMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      connection = await connect(process.env.MONGO_URI, { dbName: randomUUID() });
    }

    auctionModel = AuctionSchema.getModel(connection);
    bidModel = BidSchema.getModel(connection);
    repository = new AuctionMongoRepository(auctionModel, bidModel);
    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('should save an auction on the database', async () => {
    const auction = buildAuction({
      photos: [],
    });
    await repository.create(auction);

    const savedAuction = await auctionModel.findOne<AuctionMongoInterface>({
      id: auction.getId(),
    });

    const auctionData = auction.toJSON();

    expect(savedAuction.id).toBe(auctionData.id);
    expect(savedAuction.title).toBe(auctionData.title);
    expect(savedAuction.description).toBe(auctionData.description);
    expect(savedAuction.photos).toEqual([]);
    expect(savedAuction.startDate).toBe(auctionData.startDate);
    expect(savedAuction.endDate).toBe(auctionData.endDate);
    expect(savedAuction.startPrice).toBe(auctionData.startPrice);
    expect(savedAuction.status).toBe(auctionData.status);
    expect(savedAuction.auctioneerId).toBe(auctionData.auctioneerId);
    expect(savedAuction.createdAt).toBeInstanceOf(Date);
    expect(savedAuction.updatedAt).toBeInstanceOf(Date);
  });

  it('should find an auction by id', async () => {
    const auction = buildAuction();
    await repository.create(auction);

    const foundAuction = await repository.findById(auction.getId());

    const auctionData = auction.toJSON();
    const foundAuctionData = foundAuction.toJSON();

    expect(foundAuctionData.id).toBe(auctionData.id);
    expect(foundAuctionData.title).toBe(auctionData.title);
    expect(foundAuctionData.description).toBe(auctionData.description);
    expect(foundAuctionData.photos).toEqual(auctionData.photos);
    expect(foundAuctionData.startDate).toBe(auctionData.startDate);
    expect(foundAuctionData.endDate).toBe(auctionData.endDate);
    expect(foundAuctionData.startPrice).toBe(auctionData.startPrice);
    expect(foundAuctionData.status).toBe(auctionData.status);
    expect(foundAuctionData.auctioneerId).toBe(auctionData.auctioneerId);
    expect(foundAuctionData.createdAt).toBeTruthy();
    expect(foundAuctionData.updatedAt).toBeTruthy();
  });

  it('should return null if auction is not found', async () => {
    await repository.create(buildAuction());

    const auction = await repository.findById(randomUUID());
    expect(auction).toBeNull();
  });

  it('should update an auction', async () => {
    const auction = buildAuction();
    await repository.create(auction);

    const updatedAuction = buildAuction({
      id: new Uuid(auction.getId()),
      title: 'Updated title',
      description: 'Updated description',
      photos: [],
      startPrice: 600,
      status: AuctionStatusEnum.PUBLISHED,
    });

    await repository.update(updatedAuction);

    const foundAuction = await auctionModel.findOne<AuctionMongoInterface>({
      id: updatedAuction.getId(),
    });

    expect(foundAuction.title).toEqual('Updated title');
    expect(foundAuction.description).toEqual('Updated description');
    expect(foundAuction.photos).toEqual([]);
    expect(foundAuction.startPrice).toEqual(600);
    expect(foundAuction.status).toEqual(AuctionStatusEnum.PUBLISHED);
  });

  it('should throw an error if auction is not found when updating', async () => {
    const updatedAuction = buildAuction();
    const triggerUpdate = () => repository.update(updatedAuction);

    await expect(triggerUpdate()).rejects.toThrow(AuctionNotFoundError);

    const foundAuction = await auctionModel.findOne<AuctionMongoInterface>({
      id: updatedAuction.getId(),
    });

    expect(foundAuction).toBeNull();
  });
});
