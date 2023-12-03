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

  describe('Save', () => {
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
  });

  describe('Find by ID', () => {
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
  });

  describe('Update', () => {
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

      try {
        await repository.update(updatedAuction);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err).toBeInstanceOf(AuctionNotFoundError);
        expect(err.details).toEqual({
          auctionId: updatedAuction.getId(),
        });
      }

      const foundAuction = await auctionModel.findOne<AuctionMongoInterface>({
        id: updatedAuction.getId(),
      });

      expect(foundAuction).toBeNull();
    });
  });

  describe('Find expired published auctions', () => {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setUTCMinutes(fiveMinutesAgo.getUTCMinutes() - 5);

    const oneMinuteAgo = new Date();
    oneMinuteAgo.setUTCMinutes(oneMinuteAgo.getUTCMinutes() - 1);

    const oneMonthAgo = new Date();
    oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);

    const fiveMinutesLater = new Date();
    fiveMinutesLater.setUTCMinutes(fiveMinutesLater.getUTCMinutes() + 5);

    const oneMinuteLater = new Date();
    oneMinuteLater.setUTCMinutes(oneMinuteLater.getUTCMinutes() + 1);

    it('should find expired published auctions', async () => {
      const auction1 = buildAuction({
        startDate: oneMonthAgo.toISOString(),
        endDate: fiveMinutesAgo.toISOString(),
        status: AuctionStatusEnum.PUBLISHED,
      });
      const auction2 = buildAuction({
        startDate: oneMonthAgo.toISOString(),
        endDate: oneMinuteAgo.toISOString(),
        status: AuctionStatusEnum.PUBLISHED,
      });
      const auction3 = buildAuction({
        startDate: oneMonthAgo.toISOString(),
        endDate: fiveMinutesLater.toISOString(),
        status: AuctionStatusEnum.PUBLISHED,
      });
      const auction4 = buildAuction({
        startDate: oneMonthAgo.toISOString(),
        endDate: oneMinuteLater.toISOString(),
        status: AuctionStatusEnum.PUBLISHED,
      });

      await Promise.all([
        repository.create(auction1),
        repository.create(auction2),
        repository.create(auction3),
        repository.create(auction4),
      ]);

      const auctions = await repository.findExpiredPublishedAuctions();
      const auctionIds = auctions.map((auction) => auction.getId());

      expect(auctions).toHaveLength(2);
      expect(auctionIds).toContain(auction1.getId());
      expect(auctionIds).toContain(auction2.getId());
    });
  });
});
