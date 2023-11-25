import { randomUUID } from 'crypto';
import Auctioneer from './auctioneer.entity';
import buildAuctioneer from '../../../../../test/util/auctioneer.mock';
import Uuid from '../../../common/domain/value-objects/uuid.vo';

describe('Auctioneer', () => {
  describe('Creation', () => {
    it('should create a valid Auctioneer instance', () => {
      const id = randomUUID();
      const params = {
        id: new Uuid(id),
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'john@gmmail.com',
        registration: '12/345-A',
      };

      const auctioneer = new Auctioneer(params);
      const data = auctioneer.toJSON();

      expect(auctioneer).toBeInstanceOf(Auctioneer);
      expect(data.id).toEqual(id);
      expect(data.fistName).toEqual(params.name.firstName);
      expect(data.lastName).toEqual(params.name.lastName);
      expect(data.email).toEqual(params.email);
      expect(data.registration).toEqual(params.registration);
    });

    it('should create an Auctioneer instance using the create method', () => {
      const params = {
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'john@gmmail.com',
        registration: '12/345-A',
      };

      const auctioneer = Auctioneer.create(params);
      const data = auctioneer.toJSON();

      expect(auctioneer).toBeInstanceOf(Auctioneer);
      expect(data.id).toBeDefined();
      expect(data.fistName).toEqual(params.name.firstName);
      expect(data.lastName).toEqual(params.name.lastName);
      expect(data.email).toEqual(params.email);
      expect(data.registration).toEqual(params.registration);
    });
  });

  describe('Create auction', () => {
    it('should create an auction', () => {
      const startDate = new Date();
      startDate.setUTCHours(startDate.getUTCHours() + 1);

      const endDate = new Date();
      endDate.setUTCDate(endDate.getUTCDate() + 15);

      const auctioneer = buildAuctioneer();

      const auction = auctioneer
        .createAuction({
          title: 'Some auction tile',
          description: 'Some auction description',
          photos: [{ link: 'https://some-photo-link.com' }],
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          startPrice: 100,
        })
        .toJSON();

      expect(auction).toBeDefined();
      expect(auction.auctioneerId).toEqual(auctioneer.getId());
      expect(auction.title).toEqual('Some auction tile');
      expect(auction.description).toEqual('Some auction description');
      expect(auction.startPrice).toEqual(100);
    });
  });
});
