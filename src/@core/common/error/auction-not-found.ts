import DomainError, { ErrorCode } from './domain.error';

export default class AuctionNotFoundError extends DomainError {
  constructor(searchCriteria: {
    auctionId: string;
  }) {
    super(ErrorCode.AUCTION_NOT_FOUND, searchCriteria);
  }
}
