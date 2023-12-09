import { Mongoose } from 'mongoose';
import Bid from '../../../src/@core/auction/domain/entities/bid.entity';
import BidSchema from '../../../src/@core/auction/infra/database/schemas/bid.schema';

export default async function insertBid(params: {
  bid: Bid;
  connection: Mongoose;
}): Promise<void> {
  const mongoData = BidSchema.toDatabase(params.bid);
  const model = BidSchema.getModel(params.connection);

  await model.create(mongoData);
}
