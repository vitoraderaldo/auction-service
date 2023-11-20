import { Auctioneer, AuctioneerId } from '../entities/auctioneer.entity';

export interface AuctioneerRepository {
  save(auctioneer: Auctioneer): Promise<void>;
  getById(id: AuctioneerId): Promise<Auctioneer>;
}
