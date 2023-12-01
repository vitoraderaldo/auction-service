import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidAuctionDescriptionError extends DomainError {
  constructor(details: {
    description: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_AUCTION_DESCRIPTION, details);
  }
}
