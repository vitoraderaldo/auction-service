import { Mongoose } from 'mongoose';
import Auction from '../../../src/@core/auction/domain/entities/auction.entity';
import AuctionSchema from '../../../src/@core/auction/infra/database/mongo/schemas/auction.schema';

export default async function insertAuction(params: {
  auction: Auction;
  connection: Mongoose;
}): Promise<void> {
  const mongoData = AuctionSchema.toDatabase(params.auction);
  const model = AuctionSchema.getModel(params.connection);

  await model.create(mongoData);
}
