import AggregateRoot from '../../../common/domain/aggregate-root';
import Email from '../../../common/domain/value-objects/email.vo';
import IsoStringDate from '../../../common/domain/value-objects/iso-string-data.vo';
import PersonName from '../../../common/domain/value-objects/person-name.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Auction from './auction.entity';
import Bid from './bid.entity';

export type BidderConstructorProps = {
  id: Uuid;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export default class Bidder extends AggregateRoot {
  private id: Uuid;

  private name: PersonName;

  private email: Email;

  private createdAt: IsoStringDate;

  private updatedAt: IsoStringDate;

  constructor(params: BidderConstructorProps) {
    const { firstName, lastName } = params;
    super();
    this.id = params.id;
    this.name = new PersonName({ firstName, lastName });
    this.email = new Email(params.email);
    this.createdAt = new IsoStringDate(params.createdAt);
    this.updatedAt = new IsoStringDate(params.updatedAt);
  }

  static create(params: {
    firstName: string
    lastName: string
    email: string;
  }): Bidder {
    return new Bidder({
      id: new Uuid(),
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  createBid(params: {
    auction: Auction
    value: number;
  }): Bid {
    const { auction, value } = params;

    return auction.createBid({
      bidderId: this.id.value,
      value,
    });
  }

  toJSON() {
    return {
      id: this.id.value,
      firstName: this.name.value.firstName,
      lastName: this.name.value.lastName,
      email: this.email.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  getId(): string {
    return this.id.value;
  }
}
