import { Entity } from '../../../common/domain/entity';
import { Email } from '../../../common/domain/value-objects/email.vo';
import { PersonName } from '../../../common/domain/value-objects/person-name.vo';
import { Uuid } from '../../../common/domain/value-objects/uuid.vo';
import { AuctioneerRegistration } from '../value-objects/auctioneer-registration.vo';
import { Auction } from './auction.entity';

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

export class AuctioneerId extends Uuid {}

export type AuctioneerConstructorProps = {
  id: AuctioneerId;
  name: { firstName: string; lastName: string };
  email: string;
  registration: string;
};

export class Auctioneer extends Entity {
  private _id: AuctioneerId;
  private _name: PersonName;
  private _email: Email;
  private _registration: AuctioneerRegistration;

  constructor(params: AuctioneerConstructorProps) {
    super();
    this._id = params.id;
    this._name = new PersonName(params.name);
    this._email = new Email(params.email);
    this._registration = new AuctioneerRegistration(params.registration);
  }

  static create(params: {
    name: { firstName: string; lastName: string };
    email: string;
    registration: string;
  }): Auctioneer {
    const { name, email, registration } = params;

    return new Auctioneer({
      id: new AuctioneerId(),
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

  get id(): AuctioneerId {
    return this._id;
  }

  get name(): PersonName {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get registration(): AuctioneerRegistration {
    return this._registration;
  }
}
