import { randomUUID } from 'crypto';
import {
  Auctioneer,
  AuctioneerConstructorProps,
  AuctioneerId,
} from '../../../src/@core/auction/domain/entities/auctioneer.entity';
import { PersonName } from '../../../src/@core/common/domain/value-objects/person-name.vo';
import { Email } from '../../../src/@core/common/domain/value-objects/email.vo';
import { AuctioneerRegistration } from '../../../src/@core/auction/domain/value-objects/auctioneer-registration.vo';

export const getMockedAuctioneer = (
  props?: Partial<AuctioneerConstructorProps>,
): Auctioneer => {
  const auctioneer: AuctioneerConstructorProps = {
    id: new AuctioneerId(randomUUID()),
    name: new PersonName({ firstName: 'John', lastName: 'Doe' }),
    email: new Email('john.doe@email.com'),
    registration: new AuctioneerRegistration('12/345-A'),
    ...props,
  };

  return new Auctioneer(auctioneer);
};
