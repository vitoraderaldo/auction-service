import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Bid from '../entities/bid.entity';

export default interface BidRepository {
  findById(id: Uuid | string): Promise<Bid>;
  create(bid: Bid): Promise<void>;
}
