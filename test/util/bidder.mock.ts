import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import Bidder, {
  BidderConstructorProps,
} from '../../src/@core/auction/domain/entities/bidder.entity';
import Uuid from '../../src/@core/common/domain/value-objects/uuid.vo';
import { generateFirstName, generateLastName } from './string-generation';

export default function buildBidder(
  props?: Partial<BidderConstructorProps>,
): Bidder {
  const bidder: BidderConstructorProps = {
    id: new Uuid(randomUUID()),
    firstName: generateFirstName(),
    lastName: generateLastName(),
    email: faker.internet.email(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...props,
  };

  return new Bidder(bidder);
}
