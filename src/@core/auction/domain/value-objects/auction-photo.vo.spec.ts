import InvalidPhotoUrlError from '../../../common/error/invalid-photo-url';
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

      try {
        new AuctionPhoto({ link: invalidLink });
        expect(true).toEqual(false);
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidPhotoUrlError);
        expect(err.details).toEqual({
          url: invalidLink,
        });
      }
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
