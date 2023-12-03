import AggregateRoot from '../../../common/domain/aggregate-root';
import Email from '../../../common/domain/value-objects/email.vo';
import PersonName from '../../../common/domain/value-objects/person-name.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import AuctioneerRegistration from '../value-objects/auctioneer-registration.vo';
import Auction from './auction.entity';

export interface AuctionCreationByAuctioneer {
  title: string;
  description: string;
  photos: {
    link: string;
  }[];
  startDate: string;
  endDate: string;
  startPrice: number;
}

export type AuctioneerConstructorProps = {
  id: Uuid;
  name: { firstName: string; lastName: string };
  email: string;
  registration: string;
  createdAt: string;
  updatedAt: string;
};

export default class Auctioneer extends AggregateRoot {
  private id: Uuid;

  private name: PersonName;

  private email: Email;

  private registration: AuctioneerRegistration;

  private createdAt: string;

  private updatedAt: string;

  constructor(params: AuctioneerConstructorProps) {
    super();
    this.id = params.id;
    this.name = new PersonName(params.name);
    this.email = new Email(params.email);
    this.registration = new AuctioneerRegistration(params.registration);
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  static create(params: {
    name: { firstName: string; lastName: string };
    email: string;
    registration: string;
  }): Auctioneer {
    const { name, email, registration } = params;

    return new Auctioneer({
      id: new Uuid(),
      name,
      email,
      registration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  createAuction(params: AuctionCreationByAuctioneer): Auction {
    return Auction.create({
      ...params,
      auctioneerId: this.id.value,
    });
  }

  toJSON() {
    return {
      id: this.id.value,
      firstName: this.name.value.firstName,
      lastName: this.name.value.lastName,
      email: this.email.value,
      registration: this.registration.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getId(): string {
    return this.id.value;
  }

  getRegistration(): string {
    return this.registration.value;
  }
}
