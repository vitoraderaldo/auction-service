import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Bidder from '../entities/bidder.entity';

export default interface BidderRepository {
  findById(id: Uuid | string): Promise<Bidder>;
  findByEmail(email: string): Promise<Bidder>;
  save(bidder: Bidder): Promise<void>;
}
