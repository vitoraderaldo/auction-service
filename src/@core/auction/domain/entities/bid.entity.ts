import Entity from '../../../common/domain/entity';
import IsoStringDate from '../../../common/domain/value-objects/iso-string-data.vo';
import Price from '../../../common/domain/value-objects/price.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';

export type BidConstructorProps = {
  id: Uuid;
  bidderId: string;
  auctionId: string;
  value: Price;
  createdAt: string;
  updatedAt: string;
};

export default class Bid extends Entity {
  private id: Uuid;

  private bidderId: Uuid;

  private auctionId: Uuid;

  private value: Price;

  private createdAt: IsoStringDate;

  private updatedAt: IsoStringDate;

  constructor(params: BidConstructorProps) {
    super();
    this.id = params.id;
    this.bidderId = new Uuid(params.bidderId);
    this.auctionId = new Uuid(params.auctionId);
    this.value = params.value;
    this.createdAt = new IsoStringDate(params.createdAt);
    this.updatedAt = new IsoStringDate(params.updatedAt);
  }

  static create(params: {
    bidderId: string;
    auctionId: string;
    value: Price;
  }): Bid {
    return new Bid({
      id: new Uuid(),
      bidderId: params.bidderId,
      auctionId: params.auctionId,
      value: params.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  toJSON() {
    return {
      id: this.id.value,
      bidderId: this.bidderId.value,
      auctionId: this.auctionId.value,
      value: this.value.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  getId(): string {
    return this.id.value;
  }

  getPrice(): Price {
    return this.value;
  }

  getBidderId(): string {
    return this.bidderId.value;
  }

  getAuctionId(): string {
    return this.auctionId.value;
  }

  getCreatedAt(): string {
    return this.createdAt.value;
  }
}
