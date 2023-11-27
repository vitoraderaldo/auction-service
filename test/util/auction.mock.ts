import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import Uuid from '../../src/@core/common/domain/value-objects/uuid.vo';
import Auction, { AuctionConstructorProps } from '../../src/@core/auction/domain/entities/auction.entity';
import { AuctionStatusEnum } from '../../src/@core/auction/domain/value-objects/auction-status.vo';

export default function buildAuction(
  props?: Partial<AuctionConstructorProps>,
): Auction {
  const auction: AuctionConstructorProps = {
    id: new Uuid(randomUUID()),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    photos: [
      { link: faker.image.url() },
    ],
    startDate: new Date().toISOString(),
    endDate: faker.date.future().toISOString(),
    startPrice: Number(faker.commerce.price()),
    status: AuctionStatusEnum.CREATED,
    auctioneerId: randomUUID(),
    bids: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...props,
  };

  return new Auction(auction);
}
