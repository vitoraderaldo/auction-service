import { AuctionRepository } from '../domain/repositories/auction.repository';

interface PublishAuctionInput {
  auctionId: string;
}

export default class PublishAuctionUseCase {
  constructor(
    private readonly auctionRepository: AuctionRepository,
  ) {}

  async execute(input: PublishAuctionInput): Promise<void> {
    const auction = await this.auctionRepository.findById(input.auctionId);

    if (!auction) {
      throw new Error('Auction not found');
    }

    auction.publish();
    await this.auctionRepository.update(auction);
  }
}
