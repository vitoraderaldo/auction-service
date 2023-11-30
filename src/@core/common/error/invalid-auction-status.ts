import DomainError, { ErrorCode } from './domain.error';

export default class InvalidAuctionStatusError extends DomainError {
  constructor(details: {
    status: string;
  }) {
    super(ErrorCode.INVALID_AUCTION_STATUS, details);
  }
}
