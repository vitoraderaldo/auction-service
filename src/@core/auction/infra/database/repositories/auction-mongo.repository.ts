import Uuid from '../../../../common/domain/value-objects/uuid.vo';
import AuctionNotFoundError from '../../../../common/error/auction-not-found';
import Auction from '../../../domain/entities/auction.entity';
import { AuctionRepository } from '../../../domain/repositories/auction.repository';
import { AuctionStatusEnum } from '../../../domain/value-objects/auction-status.vo';
import AuctionSchema, { AuctionModel } from '../schemas/auction.schema';
import { BidModel } from '../schemas/bid.schema';

export default class AuctionMongoRepository implements AuctionRepository {
  constructor(
    private readonly auctionModel: AuctionModel,
    private readonly bidModel: BidModel,
  ) {}

  async create(auction: Auction): Promise<void> {
    const document = AuctionSchema.toDatabase(auction);
    await this.auctionModel.create(document);
  }

  async findById(id: Uuid | string): Promise<Auction> {
    const value = typeof id === 'string' ? new Uuid(id) : id;
    const [document, bids] = await Promise.all([
      this.auctionModel.findOne({
        id: value.value,
      }),
      this.bidModel.find({
        auctionId: value.value,
      }),
    ]);

    return AuctionSchema.toDomain(document, bids);
  }

  async findExpiredPublishedAuctions(): Promise<Auction[]> {
    const auctions = await this.auctionModel.find({
      status: AuctionStatusEnum.PUBLISHED,
      endDate: {
        $lte: new Date().toISOString(),
      },
    });

    return auctions.map((auction) => AuctionSchema.toDomain(auction, []));
  }

  async update(auction: Auction): Promise<void> {
    const document = AuctionSchema.toDatabase(auction);
    const result = await this.auctionModel.updateOne({
      id: auction.getId(),
    }, document);

    if (!result.matchedCount) {
      throw new AuctionNotFoundError({ auctionId: auction.getId() });
    }
  }

  // async updatev2(auction: Auction): Promise<void> {
  //   const auctionDoc = AuctionSchema.toDatabase(auction);
  //   const bidDocs = auction.getBids().map(BidSchema.toDatabase);

  //   // const session = await this.auctionModel.db.startSession();
  //   // session.startTransaction();

  //   const result = await this.auctionModel.updateOne({
  //     id: auction.getId(),
  //   }, auctionDoc);

  //   await this.bidModel.updateMany({
  //     auctionId: auction.getId(),
  //   }, bidDocs, { upsert: true });

  //   // await session.commitTransaction();
  //   // session.endSession();

  //   // if (!result.matchedCount) {
  //   //   throw new AuctionNotFoundError({ auctionId: auction.getId() });
  //   // }
  // }
}
