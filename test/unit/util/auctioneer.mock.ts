import { randomUUID } from 'crypto';
import Auctioneer, {
  AuctioneerConstructorProps,
} from '../../../src/@core/auction/domain/entities/auctioneer.entity';
import Uuid from '../../../src/@core/common/domain/value-objects/uuid.vo';

export default function buildAuctioneer(
  props?: Partial<AuctioneerConstructorProps>,
): Auctioneer {
  const auctioneer: AuctioneerConstructorProps = {
    id: new Uuid(randomUUID()),
    name: { firstName: 'John', lastName: 'Doe' },
    email: 'john.doe@email.com',
    registration: '12/345-A',
    ...props,
  };

  return new Auctioneer(auctioneer);
}
