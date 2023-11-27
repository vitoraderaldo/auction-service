import { AuctionRepository } from '../domain/repositories/auction.repository';
import BidRepository from '../domain/repositories/bid.repository';
import BidderRepository from '../domain/repositories/bidder.repository';

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
  ) {}

  async execute(params: CreateBidInput): Promise<CreateBidOutput> {
    const { auctionId, bidderId, value } = params;

    const auction = await this.auctionRepository.findById(auctionId);

    if (!auction) {
      throw new Error('Auction not found');
    }

    const bidder = await this.bidderRepository.findById(bidderId);

    if (!bidder) {
      throw new Error('Bidder not found');
    }

    const bid = bidder.createBid({
      auction,
      value,
    });

    await this.bidRepository.save(bid);
    const bidData = bid.toJSON();

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
