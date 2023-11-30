import DomainError, { ErrorCode } from './domain.error';

export default class InvalidBidAmountError extends DomainError {
  constructor(details: {
    startPrice?: number;
    highestBid?: number;
    value: number;
  }) {
    super(ErrorCode.INVALID_BID_AMOUNT, details);
  }
}
