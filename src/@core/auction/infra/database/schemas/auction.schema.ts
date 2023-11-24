import { Schema, Model, Mongoose } from 'mongoose';
import { Auction, AuctionId } from '../../../domain/entities/auction.entity';
import { AuctionStatusEnum } from '../../../domain/value-objects/auction-status.vo';

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
  currentPrice: number | null;
  status: string;
  auctioneerId: string;
  createdAt?: Date;
  updatedAt?: Date;
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
    currentPrice: Number,
    status: String,
    auctioneerId: String,
  },
  {
    timestamps: true,
  },
);

interface AuctionMongoDocument extends AuctionMongoInterface, Document {}
export type AuctionModel = Model<AuctionMongoDocument>;

export class AuctionSchema {
  static getModel(connection: Mongoose): AuctionModel {
    return connection.model<AuctionMongoDocument>('Auction', auctionSchema);
  }

  static toDomain(document: AuctionMongoInterface) {
    if (!document) return null;

    return new Auction({
      id: new AuctionId(document.id),
      title: document.title,
      description: document.description,
      photos: document.photos,
      startDate: document.startDate,
      endDate: document.endDate,
      startPrice: document.startPrice,
      currentPrice: document.currentPrice,
      status: document.status as AuctionStatusEnum,
      auctioneerId: document.auctioneerId,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }

  static toDatabase(domain: Auction) {
    if (!domain) return null;

    const data: AuctionMongoInterface = {
      id: domain.id.value,
      title: domain.title,
      description: domain.description,
      photos: domain.photos.map((photo) => ({ link: photo.value.link })),
      startDate: domain.startDate.value,
      endDate: domain.endDate.value,
      startPrice: domain.startPrice.value,
      currentPrice: domain.currentPrice?.value ?? null,
      status: domain.status.value,
      auctioneerId: domain.auctioneerId,
    };

    return data;
  }
}
