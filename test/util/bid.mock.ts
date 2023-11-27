import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import Uuid from '../../src/@core/common/domain/value-objects/uuid.vo';
import Bid, { BidConstructorProps } from '../../src/@core/auction/domain/entities/bid.entity';
import Price from '../../src/@core/common/domain/value-objects/price.vo';

export default function buildBid(
  props?: Partial<BidConstructorProps>,
): Bid {
  const bid: BidConstructorProps = {
    id: new Uuid(randomUUID()),
    auctionId: randomUUID(),
    bidderId: randomUUID(),
    value: new Price(faker.number.float()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...props,
  };

  return new Bid(bid);
}
