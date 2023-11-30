import AuctionNotFoundError from '../../common/error/auction-not-found';
import { AuctionRepository } from '../domain/repositories/auction.repository';

interface PublishAuctionInput {
  auctioneerId: string;
  auctionId: string;
}

export default class PublishAuctionUseCase {
  constructor(
    private readonly auctionRepository: AuctionRepository,
  ) {}

  async execute(input: PublishAuctionInput): Promise<void> {
    const { auctionId } = input;
    const auction = await this.auctionRepository.findById(auctionId);

    if (!auction) {
      throw new AuctionNotFoundError({ auctionId });
    }

    auction.publish();
    await this.auctionRepository.update(auction);
  }
}
