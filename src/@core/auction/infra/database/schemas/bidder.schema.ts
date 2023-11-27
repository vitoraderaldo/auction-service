import { Schema, Model, Mongoose } from 'mongoose';
import Uuid from '../../../../common/domain/value-objects/uuid.vo';
import Bidder from '../../../domain/entities/bidder.entity';

export interface BidderMongoInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bidderSchema = new Schema(
  {
    id: String,
    firstName: String,
    lastName: String,
    email: String,
  },
  {
    timestamps: true,
  },
);

interface BidderMongoDocument extends BidderMongoInterface, Document {}
export type BidderModel = Model<BidderMongoDocument>;

export default class BidderSchema {
  static getModel(connection: Mongoose): BidderModel {
    return connection.model<BidderMongoDocument>('Bidder', bidderSchema);
  }

  static toDomain(document: BidderMongoInterface) {
    if (!document) return null;

    return new Bidder({
      id: new Uuid(document.id),
      firstName: document.firstName,
      lastName: document.lastName,
      email: document.email,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }

  static toDatabase(domain: Bidder) {
    if (!domain) return null;

    const data = domain.toJSON();

    const mongoData: Omit<BidderMongoInterface, 'createdAt' | 'updatedAt'> = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    return mongoData;
  }
}
