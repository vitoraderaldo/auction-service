import { Mongoose } from 'mongoose';
import Bidder from '../../../src/@core/auction/domain/entities/bidder.entity';
import BidderSchema from '../../../src/@core/auction/infra/database/mongo/schemas/bidder.schema';

export default async function insertBidder(params: {
  bidder: Bidder;
  connection: Mongoose;
}): Promise<void> {
  const mongoData = BidderSchema.toDatabase(params.bidder);
  const model = BidderSchema.getModel(params.connection);

  await model.create(mongoData);
}
