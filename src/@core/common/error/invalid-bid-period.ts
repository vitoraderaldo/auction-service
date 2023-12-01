import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidBidPeriodError extends DomainError {
  constructor(details: {
    auctionId: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_BID_PERIOD, details);
  }
}
