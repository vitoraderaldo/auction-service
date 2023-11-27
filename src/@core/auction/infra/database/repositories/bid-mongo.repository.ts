import Bid from '../../../domain/entities/bid.entity';
import BidRepository from '../../../domain/repositories/bid.repository';
import BidSchema, { BidModel } from '../schemas/bid.schema';

export default class BidMongoRepository implements BidRepository {
  constructor(private readonly model: BidModel) {}

  async save(bid: Bid): Promise<void> {
    const document = BidSchema.toDatabase(bid);
    await this.model.create(document);
  }
}
