import Entity from '../../../common/domain/entity';
import IsoStringDate from '../../../common/domain/value-objects/iso-string-data.vo';
import Price from '../../../common/domain/value-objects/price.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import AuctioneerNotFoundError from '../../../common/error/auctioneer-not-found';
import DateInThePastError from '../../../common/error/date-in-the-past';
import EndDateBeforeStartDateError from '../../../common/error/date-in-the-past copy';
import InvalidAuctionDescriptionError from '../../../common/error/invalid-auction-description';
import InvalidAuctionTitleError from '../../../common/error/invalid-auction-title';
import InvalidBidAmountError from '../../../common/error/invalid-bid-amount';
import InvalidBidPeriodError from '../../../common/error/invalid-bid-period';
import NotAllowedInAuctionStatusError from '../../../common/error/not-allowed-auction-status';
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
      throw new DateInThePastError({ date: props.startDate, field: 'startDate' });
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
      throw new NotAllowedInAuctionStatusError({
        auctionId: this.getId(),
        status: this.status.toString(),
      });
    }
    this.status = new AuctionStatus(AuctionStatusEnum.PUBLISHED);
  }

  private validate() {
    if (!this.auctioneerId) {
      throw new AuctioneerNotFoundError({ auctioneerId: this.auctioneerId });
    }

    if (!this.title || this.title?.length < 5) {
      throw new InvalidAuctionTitleError({
        title: this.title,
        reason: 'Title must be at least 5 characters long',
      });
    }

    if (this.title.length > 100) {
      throw new InvalidAuctionTitleError({
        title: this.title,
        reason: 'Title must be less than 100 characters long',
      });
    }

    if (!this.description || this.description?.length < 10) {
      throw new InvalidAuctionDescriptionError({
        description: this.description,
        reason: 'Description must be at least 10 characters long',
      });
    }

    if (this.description.length > 10000) {
      throw new InvalidAuctionDescriptionError({
        description: this.description,
        reason: 'Description must be between 10 and 10000 characters',
      });
    }

    if (this.endDate.isBefore(this.startDate)) {
      throw new EndDateBeforeStartDateError({
        startDate: this.startDate.value,
        endDate: this.endDate.value,
      });
    }
  }

  getId(): string {
    return this.id.value;
  }

  getBids(): Bid[] {
    return this.bids;
  }

  private getHighestBid(): Bid {
    return this.bids.reduce((highest, current) => {
      if (highest.getPrice().isGreaterThan(current.getPrice())) {
        return highest;
      }

      return current;
    }, this.bids[0]);
  }

  createBid(params: {
    value: number;
    bidderId: string;
  }): Bid {
    const publishedStatus = new AuctionStatus(AuctionStatusEnum.PUBLISHED);

    if (!this.status.isEqualTo(publishedStatus)) {
      throw new NotAllowedInAuctionStatusError({
        auctionId: this.getId(),
        status: this.status.toString(),
      });
    }

    const now = new IsoStringDate(new Date().toISOString());

    if (this.startDate.isAfter(now)) {
      throw new InvalidBidPeriodError({ auctionId: this.getId(), reason: 'Bid period has not started' });
    }

    if (this.endDate.isBefore(now)) {
      throw new InvalidBidPeriodError({ auctionId: this.getId(), reason: 'Bid period is over' });
    }

    const bidPrice = new Price(params.value);

    if (this.startPrice.isGreaterThan(bidPrice)) {
      throw new InvalidBidAmountError({
        auctionId: this.id.value,
        value: bidPrice.value,
        startPrice: this.startPrice.value,
      });
    }

    const highestBid = this.getHighestBid()?.getPrice();

    if (highestBid?.isGreaterThanOrEqualTo(bidPrice)) {
      throw new InvalidBidAmountError({
        auctionId: this.id.value,
        value: bidPrice.value,
        highestBid: highestBid.value,
      });
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
