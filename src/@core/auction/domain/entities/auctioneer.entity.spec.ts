import { randomUUID } from 'crypto';
import { Auctioneer, AuctioneerId } from './auctioneer.entity';
import { Price } from '../../../common/domain/value-objects/price.vo';
import { buildAuctioneer } from '../../../../../test/unit/util/auctioneer.mock';

describe('Auctioneer', () => {
  describe('Creation', () => {
    it('should create a valid Auctioneer instance', () => {
      const id = randomUUID();
      const params = {
        id: new AuctioneerId(id),
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'john@gmmail.com',
        registration: '12/345-A',
      };

      const auctioneer = new Auctioneer(params);

      expect(auctioneer).toBeInstanceOf(Auctioneer);
      expect(auctioneer.id.value).toEqual(id);
      expect(auctioneer.name.value).toEqual(params.name);
      expect(auctioneer.email.value).toEqual(params.email);
      expect(auctioneer.registration.value).toEqual(params.registration);
    });

    it('should create an Auctioneer instance using the create method', () => {
      const params = {
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'john@gmmail.com',
        registration: '12/345-A',
      };

      const auctioneer = Auctioneer.create(params);

      expect(auctioneer).toBeInstanceOf(Auctioneer);
      expect(auctioneer.id.value).toBeDefined();
      expect(auctioneer.name.value).toEqual(params.name);
      expect(auctioneer.email.value).toEqual(params.email);
      expect(auctioneer.registration.value).toEqual(params.registration);
    });
  });

  describe('Create auction', () => {
    it('should create an auction', () => {
      const startDate = new Date();
      startDate.setUTCHours(startDate.getUTCHours() + 1);

      const endDate = new Date();
      endDate.setUTCDate(endDate.getUTCDate() + 15);

      const auctioneer = buildAuctioneer();

      const auction = auctioneer.createAuction({
        title: 'Some auction tile',
        description: 'Some auction description',
        photos: [{ link: 'https://some-photo-link.com' }],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startPrice: 100,
      });

      expect(auction).toBeDefined();
      expect(auction.auctioneerId).toEqual(auctioneer.id.value);
      expect(auction.title).toEqual('Some auction tile');
      expect(auction.description).toEqual('Some auction description');
      expect(auction.startPrice.isEqualTo(new Price(100))).toBe(true);
    });
  });
});
