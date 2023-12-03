import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Auction from '../entities/auction.entity';

export interface AuctionRepository {
  findById(id: Uuid | string): Promise<Auction>;
  findExpiredPublishedAuctions(): Promise<Auction[]>;
  create(auction: Auction): Promise<void>;
  update(auction: Auction): Promise<void>;
}
