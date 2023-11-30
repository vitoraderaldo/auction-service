import InvalidAuctionStatusError from '../../../common/error/invalid-auction-status';
import AuctionStatus, { AuctionStatusEnum } from './auction-status.vo';

describe('AuctionStatus', () => {
  describe('Create', () => {
    it('should create an AuctionStatus instance with a valid status', () => {
      const validStatus = AuctionStatusEnum.CREATED;
      const auctionStatus = new AuctionStatus(validStatus);
      expect(auctionStatus).toBeInstanceOf(AuctionStatus);
      expect(auctionStatus.value).toEqual(validStatus);
    });

    it('should throw an error if initialized with an invalid status', () => {
      const invalidStatus = 'INVALID_STATUS' as AuctionStatusEnum;
      expect(() => new AuctionStatus(invalidStatus)).toThrow(
        InvalidAuctionStatusError,
      );
    });
  });

  describe('isEqualTo', () => {
    it('should return true when comparing two AuctionStatus instances with the same value', () => {
      const auctionStatus1 = new AuctionStatus(AuctionStatusEnum.CREATED);
      const auctionStatus2 = new AuctionStatus(AuctionStatusEnum.CREATED);
      expect(auctionStatus1.isEqualTo(auctionStatus2)).toBeTruthy();
    });

    it('should return false when comparing two AuctionStatus instances with different values', () => {
      const auctionStatus1 = new AuctionStatus(AuctionStatusEnum.CREATED);
      const auctionStatus2 = new AuctionStatus(AuctionStatusEnum.PUBLISHED);
      expect(auctionStatus1.isEqualTo(auctionStatus2)).toBeFalsy();
    });
  });
});
