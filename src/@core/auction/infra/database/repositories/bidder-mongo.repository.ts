import Uuid from '../../../../common/domain/value-objects/uuid.vo';
import Bidder from '../../../domain/entities/bidder.entity';
import BidderRepository from '../../../domain/repositories/bidder.repository';
import BidderSchema, { BidderModel } from '../schemas/bidder.schema';

export default class BidderMongoRepository implements BidderRepository {
  constructor(private readonly model: BidderModel) {}

  async findById(id: string | Uuid): Promise<Bidder> {
    const value = typeof id === 'string' ? new Uuid(id) : id;
    const document = await this.model.findOne({
      id: value.value,
    });
    return BidderSchema.toDomain(document);
  }

  async findByEmail(email: string): Promise<Bidder> {
    const document = await this.model.findOne({
      email,
    });
    return BidderSchema.toDomain(document);
  }

  async save(bidder: Bidder): Promise<void> {
    const document = BidderSchema.toDatabase(bidder);
    await this.model.create(document);
  }
}
