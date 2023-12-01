import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class BidderNotFoundError extends DomainError {
  constructor(searchCriteria: {
    bidderId?: string;
    email?: string;
  }) {
    super(ErrorCode.BIDDER_NOT_FOUND, searchCriteria);
  }
}
