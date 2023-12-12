import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class BidNotFoundError extends DomainError {
  constructor(searchCriteria: {
    bidId: string;
  }) {
    super(ErrorCode.BID_NOT_FOUND, searchCriteria);
  }
}
