import DomainError, { ErrorCode } from './domain.error';

export default class InvalidAuctionTitleError extends DomainError {
  constructor(details: {
    title: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_AUCTION_TITLE, details);
  }
}
