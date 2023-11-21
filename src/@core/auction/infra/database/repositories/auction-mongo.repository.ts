import { Auction } from '../../../domain/entities/auction.entity';
import { AuctionRepository } from '../../../domain/repositories/auction.repository';
import { AuctionModel, AuctionSchema } from '../schemas/auction.schema';

export class AuctionMongoRepository implements AuctionRepository {
  constructor(private readonly model: AuctionModel) {}

  async save(auction: Auction): Promise<void> {
    const data = AuctionSchema.toDatabase(auction);
    await this.model.create(data);
  }
}
