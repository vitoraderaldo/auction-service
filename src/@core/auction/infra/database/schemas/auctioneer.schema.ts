import { Schema, Model, Mongoose } from 'mongoose';
import {
  Auctioneer,
  AuctioneerId,
} from '../../../domain/entities/auctioneer.entity';
import { Email } from '../../../../common/domain/value-objects/email.vo';
import { PersonName } from '../../../../common/domain/value-objects/person-name.vo';
import { AuctioneerRegistration } from '../../../domain/value-objects/auctioneer-registration.vo';

export interface AuctioneerMongoInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  registration: string;
}

const auctioneerSchema = new Schema({
  id: String,
  email: String,
  firstName: String,
  lastName: String,
  registration: String,
});

interface AuctioneerMongoDocument extends AuctioneerMongoInterface, Document {}
export type AuctioneerModel = Model<AuctioneerMongoDocument>;

export class AuctioneerSchema {
  static getModel(connection: Mongoose): AuctioneerModel {
    return connection.model<AuctioneerMongoDocument>(
      'Auctioneer',
      auctioneerSchema,
    );
  }

  static toDomain(document: AuctioneerMongoInterface) {
    if (!document) return null;

    return new Auctioneer({
      id: new AuctioneerId(document.id),
      email: new Email(document.email),
      name: new PersonName({
        firstName: document.firstName,
        lastName: document.lastName,
      }),
      registration: new AuctioneerRegistration(document.registration),
    });
  }

  static toDatabase(domain: Auctioneer) {
    if (!domain) return null;

    const data: AuctioneerMongoInterface = {
      id: domain.id.value,
      email: domain.email.value,
      firstName: domain.name.value.firstName,
      lastName: domain.name.value.lastName,
      registration: domain.registration.value,
    };

    return data;
  }
}
