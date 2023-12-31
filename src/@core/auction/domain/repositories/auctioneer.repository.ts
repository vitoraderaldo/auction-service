import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Auctioneer from '../entities/auctioneer.entity';

export default interface AuctioneerRepository {
  create(auctioneer: Auctioneer): Promise<void>;
  findById(id: Uuid | string): Promise<Auctioneer>;
  findByRegistrationOrEmail(params: {
    registration: string
    email: string
  }): Promise<Auctioneer>;
}
