import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidBidAmountError extends DomainError {
  constructor(details: {
    auctionId: string;
    startPrice?: number;
    highestBid?: number;
    value: number;
  }) {
    super(ErrorCode.INVALID_BID_AMOUNT, details);
  }
}
