import Uuid from '../../../../common/domain/value-objects/uuid.vo';
import Auction from '../../../domain/entities/auction.entity';
import { AuctionRepository } from '../../../domain/repositories/auction.repository';
import AuctionSchema, { AuctionModel } from '../schemas/auction.schema';

export default class AuctionMongoRepository implements AuctionRepository {
  constructor(private readonly model: AuctionModel) {}

  async save(auction: Auction): Promise<void> {
    const data = AuctionSchema.toDatabase(auction);
    await this.model.create(data);
  }

  async findById(id: Uuid | string): Promise<Auction> {
    const value = typeof id === 'string' ? new Uuid(id) : id;
    const auction = await this.model.findOne({
      id: value.value,
    });
    return AuctionSchema.toDomain(auction);
  }

  async update(auction: Auction): Promise<void> {
    const data = AuctionSchema.toDatabase(auction);
    const result = await this.model.updateOne({
      id: auction.getId(),
    }, data);

    if (!result.modifiedCount) {
      throw new Error('Auction not found while updating');
    }
  }
}
