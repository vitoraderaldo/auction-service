import DomainError, { ErrorCode } from './domain.error';

export default class AuctioneerAlreadyExistsError extends DomainError {
  constructor(searchCriteria: {
    email?: string;
    registration?: string;
  }) {
    super(ErrorCode.AUCTIONEER_ALREADY_EXISTS, searchCriteria);
  }
}
