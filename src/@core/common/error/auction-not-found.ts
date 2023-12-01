import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class AuctionNotFoundError extends DomainError {
  constructor(searchCriteria: {
    auctionId: string;
  }) {
    super(ErrorCode.AUCTION_NOT_FOUND, searchCriteria);
  }
}
