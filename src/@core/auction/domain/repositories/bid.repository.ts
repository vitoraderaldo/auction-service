import Bid from '../entities/bid.entity';

export default interface BidRepository {
  save(bid: Bid): Promise<void>;
}
