import { faker } from '@faker-js/faker';
import Auctioneer, {
  AuctioneerConstructorProps,
} from '../../src/@core/auction/domain/entities/auctioneer.entity';
import Uuid from '../../src/@core/common/domain/value-objects/uuid.vo';
import { generateFirstName, generateLastName } from './string-generation';

const registry1 = faker.number.int({ min: 10, max: 99 });
const registry2 = faker.number.int({ min: 100, max: 999 });
const registry3 = faker.string.alpha(1).toUpperCase();

export default function buildAuctioneer(
  props?: Partial<AuctioneerConstructorProps>,
): Auctioneer {
  const auctioneer: AuctioneerConstructorProps = {
    id: new Uuid(faker.string.uuid()),
    name: {
      firstName: generateFirstName(),
      lastName: generateLastName(),
    },
    email: faker.internet.email(),
    registration: `${registry1}/${registry2}-${registry3}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...props,
  };

  return new Auctioneer(auctioneer);
}
