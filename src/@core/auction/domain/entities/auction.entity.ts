import { Entity } from '../../../common/domain/entity';
import { IsoStringDate } from '../../../common/domain/value-objects/iso-string-data.vo';
import { Price } from '../../../common/domain/value-objects/price.vo';
import { Uuid } from '../../../common/domain/value-objects/uuid.vo';
import { AuctionPhoto } from '../value-objects/auction-photo.vo';
import {
  AuctionStatus,
  AuctionStatusEnum,
} from '../value-objects/auction-status.vo';

export interface AuctionConstructorProps {
  id: AuctionId;
  title: string;
  description: string;
  photos: AuctionPhoto[];
  startDate: IsoStringDate;
  endDate: IsoStringDate;
  startPrice: Price;
  currentPrice: Price | null;
  status: AuctionStatus;
  auctioneerId: string;
  createdAt?: IsoStringDate;
  updatedAt?: IsoStringDate;
}

export type AuctionCreateProps = Omit<
  AuctionConstructorProps,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'currentPrice'
>;

export class AuctionId extends Uuid {}

export class Auction extends Entity {
  private _id: AuctionId;
  private _title: string;
  private _description: string;
  private _photos: AuctionPhoto[];
  private _startDate: IsoStringDate;
  private _endDate: IsoStringDate;
  private _startPrice: Price;
  private _currentPrice: Price | null;
  private _status: AuctionStatus;
  private _auctioneerId: string;
  private _createdAt: IsoStringDate;
  private _updatedAt: IsoStringDate;

  constructor(props: AuctionConstructorProps) {
    super();
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._photos = props.photos;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._startPrice = props.startPrice;
    this._currentPrice = props.currentPrice;
    this._status = props.status;
    this._auctioneerId = props.auctioneerId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  static create(props: AuctionCreateProps): Auction {
    const now = new IsoStringDate(new Date().toISOString());

    if (props.startDate.isBefore(now)) {
      throw new Error('Start date must not be in the past');
    }

    return new Auction({
      ...props,
      id: new AuctionId(),
      status: new AuctionStatus(AuctionStatusEnum.CREATED),
      currentPrice: null,
    });
  }

  publish(): void {
    const createdStatus = new AuctionStatus(AuctionStatusEnum.CREATED);
    if (!this._status.isEqualTo(createdStatus)) {
      throw new Error(
        `Auction can not be published with status ${this._status.toString()}`,
      );
    }
    this._status = new AuctionStatus(AuctionStatusEnum.PUBLISHED);
  }

  private validate() {
    if (!this._auctioneerId) {
      throw new Error('Invalid auctioneer');
    }

    if (!this._title || this._title?.length < 5) {
      throw new Error('Title must be at least 5 characters long');
    }

    if (this._title.length > 100) {
      throw new Error('Title must be less than 100 characters long');
    }

    if (!this._description || this._description?.length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }

    if (this._description.length > 10000) {
      throw new Error('Description must be less than 10000 characters long');
    }

    if (this._endDate.isBefore(this._startDate)) {
      throw new Error('End date must be after start date');
    }
  }

  get id(): AuctionId {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get photos(): AuctionPhoto[] {
    return this._photos;
  }

  get startDate(): IsoStringDate {
    return this._startDate;
  }

  get endDate(): IsoStringDate {
    return this._endDate;
  }

  get startPrice(): Price {
    return this._startPrice;
  }

  get currentPrice(): Price | null {
    return this._currentPrice;
  }

  get status(): AuctionStatus {
    return this._status;
  }

  get auctioneerId(): string {
    return this._auctioneerId;
  }

  get createdAt(): IsoStringDate {
    return this._createdAt;
  }

  get updatedAt(): IsoStringDate {
    return this._updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      photos: this._photos,
      startDate: this._startDate,
      endDate: this._endDate,
      startPrice: this._startPrice,
      currentPrice: this._currentPrice,
      status: this._status,
      auctioneerId: this._auctioneerId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
