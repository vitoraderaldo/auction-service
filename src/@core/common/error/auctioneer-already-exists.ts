import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class AuctioneerAlreadyExistsError extends DomainError {
  constructor(searchCriteria: {
    email?: string;
    registration?: string;
  }) {
    super(ErrorCode.AUCTIONEER_ALREADY_EXISTS, searchCriteria);
  }
}
