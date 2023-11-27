import Entity from '../../../common/domain/entity';
import IsoStringDate from '../../../common/domain/value-objects/iso-string-data.vo';
import Price from '../../../common/domain/value-objects/price.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import AuctionPhoto from '../value-objects/auction-photo.vo';
import AuctionStatus, {
  AuctionStatusEnum,
} from '../value-objects/auction-status.vo';
import Bid from './bid.entity';

export interface AuctionConstructorProps {
  id: Uuid;
  title: string;
  description: string;
  photos: { link: string }[];
  startDate: string;
  endDate: string;
  startPrice: number;
  status: AuctionStatusEnum;
  auctioneerId: string;
  bids: Bid[];
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

  private status: AuctionStatus;

  private auctioneerId: string;

  private createdAt: IsoStringDate;

  private updatedAt: IsoStringDate;

  private bids: Bid[];

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
    this.status = new AuctionStatus(props.status);
    this.auctioneerId = props.auctioneerId;
    this.bids = props.bids;
    this.createdAt = new IsoStringDate(props.createdAt);
    this.updatedAt = new IsoStringDate(props.updatedAt);

    this.validate();
  }

  static create(props: AuctionCreateProps): Auction {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const startDate = new Date(props.startDate);

    if (startDate.getTime() < fiveMinutesAgo.getTime()) {
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
      bids: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  createBid(params: {
    value: number;
    bidderId: string;
  }): Bid {
    const publishedStatus = new AuctionStatus(AuctionStatusEnum.PUBLISHED);

    if (!this.status.isEqualTo(publishedStatus)) {
      throw new Error(
        `Auction can not receive bid when status is '${this.status.toString()}'`,
      );
    }

    const now = new IsoStringDate(new Date().toISOString());

    if (this.startDate.isAfter(now)) {
      throw new Error('Bid period has not started yet');
    }

    if (this.endDate.isBefore(now)) {
      throw new Error('Bid period is over');
    }

    const bidPrice = new Price(params.value);

    if (this.startPrice.isGreaterThan(bidPrice)) {
      throw new Error('Bid value must be greater than start price');
    }

    const isGreaterThanOtherBids = this.bids.every(
      (bid) => bidPrice.isGreaterThan(bid.getPrice()),
    );

    if (!isGreaterThanOtherBids) {
      throw new Error('Bid value is not greater than other bids');
    }

    const newBid = Bid.create({
      bidderId: params.bidderId,
      auctionId: this.id.value,
      value: bidPrice,
    });

    this.bids.push(newBid);

    return newBid;
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
      status: this.status.value,
      bids: this.bids.map((bid) => bid.toJSON()),
      auctioneerId: this.auctioneerId,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
