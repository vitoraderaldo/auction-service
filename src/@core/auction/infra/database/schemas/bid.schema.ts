import { Schema, Model, Mongoose } from 'mongoose';
import Uuid from '../../../../common/domain/value-objects/uuid.vo';
import Bid from '../../../domain/entities/bid.entity';
import Price from '../../../../common/domain/value-objects/price.vo';

export interface BidMongoInterface {
  id: string;
  bidderId: string;
  auctionId: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new Schema(
  {
    id: String,
    bidderId: String,
    auctionId: String,
    value: Number,
  },
  {
    timestamps: true,
  },
);

interface BidMongoDocument extends BidMongoInterface, Document {}
export type BidModel = Model<BidMongoDocument>;

export default class BidSchema {
  static getModel(connection: Mongoose): BidModel {
    return connection.model<BidMongoDocument>('Bid', bidSchema);
  }

  static toDomain(document: BidMongoInterface) {
    if (!document) return null;

    return new Bid({
      id: new Uuid(document.id),
      bidderId: document.bidderId,
      auctionId: document.auctionId,
      value: new Price(document.value),
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }

  static toDatabase(domain: Bid) {
    if (!domain) return null;

    const data = domain.toJSON();

    const mongoData: Omit<BidMongoInterface, 'createdAt' | 'updatedAt'> = {
      id: data.id,
      bidderId: data.bidderId,
      auctionId: data.auctionId,
      value: data.value,
    };

    return mongoData;
  }
}
