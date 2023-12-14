import { Mongoose } from 'mongoose';
import Auctioneer from '../../../src/@core/auction/domain/entities/auctioneer.entity';
import AuctioneerSchema from '../../../src/@core/auction/infra/database/mongo/schemas/auctioneer.schema';

export default async function insertAuctioneer(params: {
  auctioneer: Auctioneer;
  connection: Mongoose;
}): Promise<void> {
  const mongoData = AuctioneerSchema.toDatabase(params.auctioneer);
  const model = AuctioneerSchema.getModel(params.connection);

  await model.create(mongoData);
}
