import DomainError, { ErrorCode } from './domain.error';

export default class BidderNotFoundError extends DomainError {
  constructor(searchCriteria: {
    bidderId?: string;
    email?: string;
  }) {
    super(ErrorCode.BIDDER_NOT_FOUND, searchCriteria);
  }
}
