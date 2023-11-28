import { Schema, Model, Mongoose } from 'mongoose';
import Auction from '../../../domain/entities/auction.entity';
import { AuctionStatusEnum } from '../../../domain/value-objects/auction-status.vo';
import Uuid from '../../../../common/domain/value-objects/uuid.vo';
import BidSchema, { BidMongoInterface } from './bid.schema';

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

  static toDomain(
    auction: AuctionMongoInterface,
    bids: BidMongoInterface[],
  ) {
    if (!auction) return null;

    return new Auction({
      id: new Uuid(auction.id),
      title: auction.title,
      description: auction.description,
      photos: auction.photos,
      startDate: auction.startDate,
      endDate: auction.endDate,
      startPrice: auction.startPrice,
      status: auction.status as AuctionStatusEnum,
      auctioneerId: auction.auctioneerId,
      bids: bids.map(BidSchema.toDomain),
      createdAt: auction.createdAt.toISOString(),
      updatedAt: auction.updatedAt.toISOString(),
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
