import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidAuctionStatusError extends DomainError {
  constructor(details: {
    status: string;
  }) {
    super(ErrorCode.INVALID_AUCTION_STATUS, details);
  }
}
