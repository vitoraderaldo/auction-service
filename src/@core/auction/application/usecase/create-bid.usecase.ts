import { LoggerInterface } from '../../../common/application/service/logger';
import AuctionNotFoundError from '../../error/auction-not-found';
import BidderNotFoundError from '../../error/bidder-not-found';
import { AuctionRepository } from '../../domain/repositories/auction.repository';
import BidRepository from '../../domain/repositories/bid.repository';
import BidderRepository from '../../domain/repositories/bidder.repository';

interface CreateBidInput {
  auctionId: string;
  bidderId: string;
  value: number;
}

export interface CreateBidOutput {
  id: string;
  value: number;
  bidderId: string;
  auctionId: string;
  createdAt: string;
  updatedAt: string;
}

export default class CreateBidUseCase {
  constructor(
    private readonly auctionRepository: AuctionRepository,
    private readonly bidderRepository: BidderRepository,
    private readonly bidRepository: BidRepository,
    private readonly logger: LoggerInterface,
  ) {}

  async execute(params: CreateBidInput): Promise<CreateBidOutput> {
    const { auctionId, bidderId, value } = params;
    this.logger.info(`Starting to create bid for auctionId (${auctionId}) and bidderId (${bidderId})`);

    const auction = await this.auctionRepository.findById(auctionId);
    if (!auction) {
      throw new AuctionNotFoundError({ auctionId });
    }

    const bidder = await this.bidderRepository.findById(bidderId);
    if (!bidder) {
      throw new BidderNotFoundError({ bidderId });
    }

    const bid = bidder.createBid({
      auction,
      value,
    });

    await this.bidRepository.create(bid);
    const bidData = bid.toJSON();

    this.logger.info(`Finished to create bid for auctionId (${auctionId}) and bidderId (${bidderId})`);

    return {
      id: bidData.id,
      value: bidData.value,
      bidderId: bidData.bidderId,
      auctionId: bidData.auctionId,
      createdAt: bidData.createdAt,
      updatedAt: bidData.updatedAt,
    };
  }
}
