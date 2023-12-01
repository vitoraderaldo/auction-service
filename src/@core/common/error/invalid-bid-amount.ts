import DomainError from './domain.error';
import ErrorCode from './error-code';

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
