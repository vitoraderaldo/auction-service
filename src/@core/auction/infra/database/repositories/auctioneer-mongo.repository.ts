import { AuctioneerRepository } from '../../../domain/repositories/auctioneer.repository';
import {
  Auctioneer,
  AuctioneerId,
} from '../../../domain/entities/auctioneer.entity';
import {
  AuctioneerModel,
  AuctioneerSchema,
} from '../schemas/auctioneer.schema';

export class AuctioneerMongoRepository implements AuctioneerRepository {
  constructor(private readonly model: AuctioneerModel) {}

  async findById(id: AuctioneerId | string): Promise<Auctioneer> {
    const value = typeof id === 'string' ? new AuctioneerId(id) : id;
    const document = await this.model.findOne({
      id: value.value,
    });

    return AuctioneerSchema.toDomain(document);
  }

  async save(auctioneer: Auctioneer): Promise<void> {
    const data = AuctioneerSchema.toDatabase(auctioneer);
    await this.model.create(data);
  }
}
