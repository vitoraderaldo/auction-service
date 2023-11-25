import Entity from '../../../common/domain/entity';
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
};

export default class Auctioneer extends Entity {
  private id: Uuid;

  private name: PersonName;

  private email: Email;

  private registration: AuctioneerRegistration;

  constructor(params: AuctioneerConstructorProps) {
    super();
    this.id = params.id;
    this.name = new PersonName(params.name);
    this.email = new Email(params.email);
    this.registration = new AuctioneerRegistration(params.registration);
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
      fistName: this.name.value.firstName,
      lastName: this.name.value.lastName,
      email: this.email.value,
      registration: this.registration.value,
    };
  }

  getId(): string {
    return this.id.value;
  }
}
