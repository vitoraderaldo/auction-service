import DomainError, { ErrorCode } from './domain.error';

export default class InvalidAuctionDescriptionError extends DomainError {
  constructor(details: {
    description: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_AUCTION_DESCRIPTION, details);
  }
}
