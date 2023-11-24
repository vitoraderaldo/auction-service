import Entity from '../../../common/domain/entity';
import IsoStringDate from '../../../common/domain/value-objects/iso-string-data.vo';
import Price from '../../../common/domain/value-objects/price.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import AuctionPhoto from '../value-objects/auction-photo.vo';
import AuctionStatus, {
  AuctionStatusEnum,
} from '../value-objects/auction-status.vo';

export interface AuctionConstructorProps {
  id: Uuid;
  title: string;
  description: string;
  photos: { link: string }[];
  startDate: string;
  endDate: string;
  startPrice: number;
  currentPrice: number | null;
  status: AuctionStatusEnum;
  auctioneerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuctionCreateProps {
  title: string;
  description: string;
  photos: {
    link: string;
  }[];
  startDate: string;
  endDate: string;
  startPrice: number;
  auctioneerId: string;
}

export default class Auction extends Entity {
  private id: Uuid;

  private title: string;

  private description: string;

  private photos: AuctionPhoto[];

  private startDate: IsoStringDate;

  private endDate: IsoStringDate;

  private startPrice: Price;

  private currentPrice: Price | null;

  private status: AuctionStatus;

  private auctioneerId: string;

  private createdAt: IsoStringDate;

  private updatedAt: IsoStringDate;

  constructor(props: AuctionConstructorProps) {
    super();
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.photos = props.photos.map(
      (photo) => new AuctionPhoto({ link: photo.link }),
    );
    this.startDate = new IsoStringDate(props.startDate);
    this.endDate = new IsoStringDate(props.endDate);
    this.startPrice = new Price(props.startPrice);
    this.currentPrice = props.currentPrice
      ? new Price(props.currentPrice)
      : null;
    this.status = new AuctionStatus(props.status);
    this.auctioneerId = props.auctioneerId;
    this.createdAt = new IsoStringDate(props.createdAt);
    this.updatedAt = new IsoStringDate(props.updatedAt);

    this.validate();
  }

  static create(props: AuctionCreateProps): Auction {
    const now = new Date();
    const startDate = new Date(props.startDate);

    if (startDate.getTime() < now.getTime()) {
      throw new Error('Start date must not be in the past');
    }

    return new Auction({
      title: props.title,
      description: props.description,
      photos: props.photos,
      startDate: props.startDate,
      endDate: props.endDate,
      startPrice: props.startPrice,
      auctioneerId: props.auctioneerId,
      id: new Uuid(),
      status: AuctionStatusEnum.CREATED,
      currentPrice: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  }

  publish(): void {
    const createdStatus = new AuctionStatus(AuctionStatusEnum.CREATED);
    if (!this.status.isEqualTo(createdStatus)) {
      throw new Error(
        `Auction can not be published with status ${this.status.toString()}`,
      );
    }
    this.status = new AuctionStatus(AuctionStatusEnum.PUBLISHED);
  }

  private validate() {
    if (!this.auctioneerId) {
      throw new Error('Invalid auctioneer');
    }

    if (!this.title || this.title?.length < 5) {
      throw new Error('Title must be at least 5 characters long');
    }

    if (this.title.length > 100) {
      throw new Error('Title must be less than 100 characters long');
    }

    if (!this.description || this.description?.length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }

    if (this.description.length > 10000) {
      throw new Error('Description must be less than 10000 characters long');
    }

    if (this.endDate.isBefore(this.startDate)) {
      throw new Error('End date must be after start date');
    }
  }

  getId(): string {
    return this.id.value;
  }

  toJSON() {
    return {
      id: this.id.value,
      title: this.title,
      description: this.description,
      photos: this.photos.map((photo) => photo.toJSON()),
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      startPrice: this.startPrice.value,
      currentPrice: this.currentPrice?.value ?? null,
      status: this.status.value,
      auctioneerId: this.auctioneerId,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
