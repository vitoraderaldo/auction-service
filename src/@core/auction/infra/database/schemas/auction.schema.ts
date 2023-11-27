import { Schema, Model, Mongoose } from 'mongoose';
import Auction from '../../../domain/entities/auction.entity';
import { AuctionStatusEnum } from '../../../domain/value-objects/auction-status.vo';
import Uuid from '../../../../common/domain/value-objects/uuid.vo';

export interface AuctionMongoInterface {
  id: string;
  title: string;
  description: string;
  photos: {
    link: string;
  }[];
  startDate: string;
  endDate: string;
  startPrice: number;
  status: string;
  auctioneerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const auctionSchema = new Schema(
  {
    id: String,
    title: String,
    description: String,
    photos: [
      {
        link: String,
      },
    ],
    startDate: String,
    endDate: String,
    startPrice: Number,
    status: String,
    auctioneerId: String,
  },
  {
    timestamps: true,
  },
);

interface AuctionMongoDocument extends AuctionMongoInterface, Document {}
export type AuctionModel = Model<AuctionMongoDocument>;

export default class AuctionSchema {
  static getModel(connection: Mongoose): AuctionModel {
    return connection.model<AuctionMongoDocument>('Auction', auctionSchema);
  }

  static toDomain(document: AuctionMongoInterface) {
    if (!document) return null;

    return new Auction({
      id: new Uuid(document.id),
      title: document.title,
      description: document.description,
      photos: document.photos,
      startDate: document.startDate,
      endDate: document.endDate,
      startPrice: document.startPrice,
      status: document.status as AuctionStatusEnum,
      auctioneerId: document.auctioneerId,
      bids: [],
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }

  static toDatabase(domain: Auction) {
    if (!domain) return null;

    const data = domain.toJSON();

    const mongoData: Omit<AuctionMongoInterface, 'createdAt' | 'updatedAt'> = {
      id: data.id,
      title: data.title,
      description: data.description,
      photos: data.photos,
      startDate: data.startDate,
      endDate: data.endDate,
      startPrice: data.startPrice,
      status: data.status,
      auctioneerId: data.auctioneerId,
    };

    return mongoData;
  }
}
