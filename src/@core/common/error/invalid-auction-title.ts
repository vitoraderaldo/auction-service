import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidAuctionTitleError extends DomainError {
  constructor(details: {
    title: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_AUCTION_TITLE, details);
  }
}
