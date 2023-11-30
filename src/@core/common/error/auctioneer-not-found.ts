import DomainError, { ErrorCode } from './domain.error';

export default class AuctioneerNotFoundError extends DomainError {
  constructor(searchCriteria: {
    id?: string;
    email?: string;
  }) {
    super(ErrorCode.AUCTIONEER_NOT_FOUND, searchCriteria);
  }
}
