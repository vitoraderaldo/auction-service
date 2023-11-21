import { randomUUID } from 'crypto';
import { PersonName } from '../../../common/domain/value-objects/person-name.vo';
import { AuctioneerRegistration } from '../value-objects/auctioneer-registration.vo';
import { Auctioneer } from './auctioneer.entity';
import { Email } from '../../../common/domain/value-objects/email.vo';
import { AuctionPhoto } from '../value-objects/auction-photo.vo';
import { IsoStringDate } from '../../../common/domain/value-objects/iso-string-data.vo';
import { Price } from '../../../common/domain/value-objects/price.vo';

describe('Auctioneer', () => {
  describe('Creation', () => {
    it('should create a valid Auctioneer instance without id', () => {
      const params = {
        name: new PersonName({ firstName: 'John', lastName: 'Doe' }),
        email: new Email('john@gmmail.com'),
        registration: new AuctioneerRegistration('12/345-A'),
      };

      const auctioneer = new Auctioneer(params);

      expect(auctioneer).toBeInstanceOf(Auctioneer);
      expect(auctioneer.id.value).toBeDefined();
      expect(auctioneer.name.isEqualTo(params.name)).toBe(true);
      expect(auctioneer.email.isEqualTo(params.email)).toBe(true);
      expect(auctioneer.registration.isEqualTo(params.registration)).toBe(true);
    });

    it('should create a valid Auctioneer instance passing the id', () => {
      const id = randomUUID();
      const params = {
        id: id,
        name: new PersonName({ firstName: 'John', lastName: 'Doe' }),
        email: new Email('john@gmmail.com'),
        registration: new AuctioneerRegistration('12/345-A'),
      };

      const auctioneer = new Auctioneer(params);

      expect(auctioneer).toBeInstanceOf(Auctioneer);
      expect(auctioneer.id.value).toEqual(id);
      expect(auctioneer.name.isEqualTo(params.name)).toBe(true);
      expect(auctioneer.email.isEqualTo(params.email)).toBe(true);
      expect(auctioneer.registration.isEqualTo(params.registration)).toBe(true);
    });

    it('should create an Auctioneer instance using the create method', () => {
      const params = {
        name: new PersonName({ firstName: 'John', lastName: 'Doe' }),
        email: new Email('john@gmmail.com'),
        registration: new AuctioneerRegistration('12/345-A'),
      };

      const auctioneer = Auctioneer.create(params);

      expect(auctioneer).toBeInstanceOf(Auctioneer);
      expect(auctioneer.id.value).toBeDefined();
      expect(auctioneer.name.isEqualTo(params.name)).toBe(true);
      expect(auctioneer.email.isEqualTo(params.email)).toBe(true);
      expect(auctioneer.registration.isEqualTo(params.registration)).toBe(true);
    });
  });

  describe('Create auction', () => {
    it('should create an auction', () => {
      const startDate = new Date();
      startDate.setUTCHours(startDate.getUTCHours() + 1);

      const endDate = new Date();
      endDate.setUTCDate(endDate.getUTCDate() + 15);

      const auctioneer = new Auctioneer({
        name: new PersonName({ firstName: 'John', lastName: 'Doe' }),
        email: new Email('john@gmmail.com'),
        registration: new AuctioneerRegistration('12/345-A'),
      });

      const auction = auctioneer.createAuction({
        title: 'Some auction tile',
        description: 'Some auction description',
        photos: [new AuctionPhoto({ link: 'https://some-photo-link.com' })],
        startDate: new IsoStringDate(startDate.toISOString()),
        endDate: new IsoStringDate(endDate.toISOString()),
        startPrice: new Price(100),
      });

      expect(auction).toBeDefined();
      expect(auction.auctioneerId).toEqual(auctioneer.id.value);
      expect(auction.title).toEqual('Some auction tile');
      expect(auction.description).toEqual('Some auction description');
      expect(auction.startPrice.isEqualTo(new Price(100))).toBe(true);
    });
  });
});
