import Auction from '../entities/auction.entity';

export interface AuctionRepository {
  save(auction: Auction): Promise<void>;
}
