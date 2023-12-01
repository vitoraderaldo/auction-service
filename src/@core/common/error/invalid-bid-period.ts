import DomainError, { ErrorCode } from './domain.error';

export default class InvalidBidPeriodError extends DomainError {
  constructor(details: {
    auctionId: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_BID_PERIOD, details);
  }
}
