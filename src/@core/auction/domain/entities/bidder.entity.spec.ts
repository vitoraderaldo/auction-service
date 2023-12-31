import { faker } from '@faker-js/faker';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Bidder, { BidderConstructorProps } from './bidder.entity';
import { generateFirstName, generateLastName } from '../../../../../test/util/string-generation';

describe('Bidder Entity', () => {
  it('should create a Bidder instance', () => {
    const bidderId = faker.string.uuid();

    // Mocking the parameters
    const params: BidderConstructorProps = {
      id: new Uuid(bidderId),
      firstName: generateFirstName(),
      lastName: generateLastName(),
      email: faker.internet.email(),
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };

    const bidder = new Bidder(params);

    expect(bidder).toBeInstanceOf(Bidder);
    expect(bidder.toJSON()).toEqual({
      id: bidderId,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  });

  it('should create a Bidder instance using the static create method', () => {
    const params = {
      firstName: generateFirstName(),
      lastName: generateLastName(),
      email: faker.internet.email(),
    };

    const bidder = Bidder.create(params);

    expect(bidder).toBeInstanceOf(Bidder);
    expect(bidder.toJSON()).toEqual(expect.objectContaining({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
    }));
    expect(bidder.getId()).toBeTruthy();
  });
});
