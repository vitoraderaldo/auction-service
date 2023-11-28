import Bid from '../entities/bid.entity';

export default interface BidRepository {
  create(bid: Bid): Promise<void>;
}
