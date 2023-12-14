import Uuid from '../../../../../common/domain/value-objects/uuid.vo';
import Bid from '../../../../domain/entities/bid.entity';
import BidRepository from '../../../../domain/repositories/bid.repository';
import BidSchema, { BidModel } from '../schemas/bid.schema';

export default class BidMongoRepository implements BidRepository {
  constructor(private readonly model: BidModel) {}

  async findById(id: Uuid | string): Promise<Bid> {
    const value = typeof id === 'string' ? new Uuid(id) : id;
    const document = await this.model.findOne({
      id: value.value.toString(),
    }).exec();
    return document ? BidSchema.toDomain(document) : null;
  }

  async create(bid: Bid): Promise<void> {
    const document = BidSchema.toDatabase(bid);
    await this.model.create(document);
  }
}
