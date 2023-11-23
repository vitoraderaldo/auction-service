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
  id?: AuctioneerId | string;
  name: PersonName;
  email: Email;
  registration: AuctioneerRegistration;
};

export class Auctioneer extends Entity {
  private _id: AuctioneerId;
  private _name: PersonName;
  private _email: Email;
  private _registration: AuctioneerRegistration;

  constructor(params: AuctioneerConstructorProps) {
    super();
    this._id =
      typeof params.id === 'string'
        ? new AuctioneerId(params.id)
        : params.id || new AuctioneerId();
    this._name = params.name;
    this._email = params.email;
    this._registration = params.registration;
  }

  static create(params: {
    name: PersonName;
    email: Email;
    registration: AuctioneerRegistration;
  }): Auctioneer {
    return new Auctioneer(params);
  }

  createAuction(params: AuctionCreationByAuctioneer): Auction {
    return Auction.create({
      ...params,
      auctioneerId: this.id.value,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      registration: this.registration,
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
