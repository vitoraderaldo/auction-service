import AuctionPhoto from './auction-photo.vo';

describe('AuctionPhoto', () => {
  describe('constructor', () => {
    it('should create an AuctionPhoto instance with a valid link', () => {
      const validLink = 'https://example.com/photo.jpg';
      const auctionPhoto = new AuctionPhoto({ link: validLink });
      expect(auctionPhoto).toBeInstanceOf(AuctionPhoto);
      expect(auctionPhoto.value.link).toEqual(validLink);
    });

    it('should throw an error if initialized with an invalid link', () => {
      const invalidLink = 'invalid-link';
      expect(() => new AuctionPhoto({ link: invalidLink })).toThrow(
        `Auction photo link '${invalidLink}' is not a valid URL`,
      );
    });
  });

  describe('isEqualTo', () => {
    it('should return true when comparing two AuctionPhoto instances with the same link', () => {
      const link = 'https://example.com/photo.jpg';
      const auctionPhoto1 = new AuctionPhoto({ link });
      const auctionPhoto2 = new AuctionPhoto({ link });
      expect(auctionPhoto1.isEqualTo(auctionPhoto2)).toBeTruthy();
    });

    it('should return false when comparing two AuctionPhoto instances with different links', () => {
      const auctionPhoto1 = new AuctionPhoto({
        link: 'https://example.com/photo1.jpg',
      });
      const auctionPhoto2 = new AuctionPhoto({
        link: 'https://example.com/photo2.jpg',
      });
      expect(auctionPhoto1.isEqualTo(auctionPhoto2)).toBeFalsy();
    });
  });
});
