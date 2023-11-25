import { Schema, Model, Mongoose } from 'mongoose';
import Auctioneer from '../../../domain/entities/auctioneer.entity';
import Uuid from '../../../../common/domain/value-objects/uuid.vo';

export interface AuctioneerMongoInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  registration: string;
  createdAt: Date;
  updatedAt: Date;
}

const auctioneerSchema = new Schema({
  id: String,
  email: String,
  firstName: String,
  lastName: String,
  registration: String,
}, {
  timestamps: true,
});

interface AuctioneerMongoDocument extends AuctioneerMongoInterface, Document {}
export type AuctioneerModel = Model<AuctioneerMongoDocument>;

export default class AuctioneerSchema {
  static getModel(connection: Mongoose): AuctioneerModel {
    return connection.model<AuctioneerMongoDocument>(
      'Auctioneer',
      auctioneerSchema,
    );
  }

  static toDomain(document: AuctioneerMongoInterface) {
    if (!document) return null;

    return new Auctioneer({
      id: new Uuid(document.id),
      email: document.email,
      name: {
        firstName: document.firstName,
        lastName: document.lastName,
      },
      registration: document.registration,
    });
  }

  static toDatabase(domain: Auctioneer) {
    if (!domain) return null;

    const data = domain.toJSON();

    const mongoData: Omit<AuctioneerMongoInterface, 'createdAt' | 'updatedAt'> = {
      id: data.id,
      email: data.email,
      firstName: data.fistName,
      lastName: data.lastName,
      registration: data.registration,
    };

    return mongoData;
  }
}
