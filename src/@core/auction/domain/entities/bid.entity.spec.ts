import { randomUUID } from 'crypto';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Price from '../../../common/domain/value-objects/price.vo';
import Bid, { BidConstructorProps } from './bid.entity';

describe('Bid Entity', () => {
  it('should create a Bid instance', () => {
    const bidId = randomUUID();
    const bidderId = randomUUID();
    const auctionId = randomUUID();

    const price = 100;

    // Mocking the parameters
    const params: BidConstructorProps = {
      id: new Uuid(bidId),
      bidderId,
      auctionId,
      value: new Price(price),
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };

    const bid = new Bid(params);

    expect(bid).toBeInstanceOf(Bid);
    expect(bid.toJSON()).toEqual({
      id: bidId,
      bidderId,
      auctionId,
      value: price,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  });

  it('should create a Bid instance using the static create method', () => {
    const bidderId = randomUUID();
    const auctionId = randomUUID();
    const price = 100;

    const params = {
      bidderId,
      auctionId,
      value: new Price(price),
    };

    const bid = Bid.create(params);

    expect(bid).toBeInstanceOf(Bid);
    expect(bid.toJSON()).toEqual(expect.objectContaining({
      bidderId,
      auctionId,
      value: price,
    }));
    expect(bid.getId()).toBeTruthy();
  });
});
