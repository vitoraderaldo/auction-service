import { Auctioneer, AuctioneerId } from '../entities/auctioneer.entity';

export interface AuctioneerRepository {
  save(auctioneer: Auctioneer): Promise<void>;
  findById(id: AuctioneerId | string): Promise<Auctioneer>;
}
