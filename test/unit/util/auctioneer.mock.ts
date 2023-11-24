import { randomUUID } from 'crypto';
import {
  Auctioneer,
  AuctioneerConstructorProps,
  AuctioneerId,
} from '../../../src/@core/auction/domain/entities/auctioneer.entity';

export const buildAuctioneer = (
  props?: Partial<AuctioneerConstructorProps>,
): Auctioneer => {
  const auctioneer: AuctioneerConstructorProps = {
    id: new AuctioneerId(randomUUID()),
    name: { firstName: 'John', lastName: 'Doe' },
    email: 'john.doe@email.com',
    registration: '12/345-A',
    ...props,
  };

  return new Auctioneer(auctioneer);
};
