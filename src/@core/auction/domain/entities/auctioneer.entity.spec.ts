import { randomUUID } from 'crypto';
import { PersonName } from '../../../common/domain/value-objects/person-name.vo';
import { AuctioneerRegistration } from '../value-objects/auctioneer-registration.vo';
import { Auctioneer } from './auctioneer.entity';
import { Email } from '../../../common/domain/value-objects/email.vo';

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
});
