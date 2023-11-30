import DomainError, { ErrorCode } from './domain.error';

export default class BidderAlreadyExistsError extends DomainError {
  constructor(searchCriteria: {
    email?: string;
  }) {
    super(ErrorCode.BIDDER_ALREADY_EXISTS, searchCriteria);
  }
}
