import AuctioneerRegistration from './auctioneer-registration.vo';

describe('Auctioneer Registration - Object Value', () => {
  it('should create a valid 3-character AuctioneerRegistration instance', () => {
    const registration = '123';
    const auctioneerRegistration1 = new AuctioneerRegistration(registration);
    expect(auctioneerRegistration1).toBeInstanceOf(AuctioneerRegistration);
    expect(auctioneerRegistration1.value).toBe(registration);
  });

  it('should create a valid 8-character AuctioneerRegistration instance', () => {
    const registration = '12/345-A';
    const auctioneerRegistration2 = new AuctioneerRegistration(registration);
    expect(auctioneerRegistration2).toBeInstanceOf(AuctioneerRegistration);
    expect(auctioneerRegistration2.value).toBe(registration);
  });

  it('should throw an error for a registration less than 3 characters long', () => {
    const shortRegistration = '12';
    expect(() => new AuctioneerRegistration(shortRegistration)).toThrow(
      'Registration must be at least 3 characters long',
    );
  });

  it('should throw an error for a 3-character registration that is not a number', () => {
    const invalidRegistration = '12c';
    expect(() => new AuctioneerRegistration(invalidRegistration)).toThrow(
      'Registration must be a number',
    );
  });

  it('should throw an error for an invalid format registration', () => {
    const invalidFormatRegistration = '12/345';
    expect(() => new AuctioneerRegistration(invalidFormatRegistration)).toThrow(
      'Registration is not in a valid format',
    );
  });

  it('should return true when two instances are equal', () => {
    const registration = '12/345-A';
    const registration1 = new AuctioneerRegistration(registration);
    const registration2 = new AuctioneerRegistration(registration);

    const isEqual = registration1.isEqualTo(registration2);
    expect(isEqual).toBe(true);
  });

  it('should return false when two instances are not equal', () => {
    const registration1 = new AuctioneerRegistration('12/345-A');
    const registration2 = new AuctioneerRegistration('12/345-B');

    const isEqual = registration1.isEqualTo(registration2);
    expect(isEqual).toBe(false);
  });
});
