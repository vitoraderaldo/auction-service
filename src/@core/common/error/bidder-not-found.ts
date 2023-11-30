import DomainError, { ErrorCode } from './domain.error';

export default class BidderNotFoundError extends DomainError {
  constructor(searchCriteria: {
    id?: string;
    email?: string;
  }) {
    super(ErrorCode.BIDDER_NOT_FOUND, searchCriteria);
  }
}
