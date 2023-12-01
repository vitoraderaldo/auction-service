import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class BidderAlreadyExistsError extends DomainError {
  constructor(searchCriteria: {
    email?: string;
  }) {
    super(ErrorCode.BIDDER_ALREADY_EXISTS, searchCriteria);
  }
}
