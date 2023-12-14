import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class AuctioneerNotFoundError extends DomainError {
  constructor(searchCriteria: {
    auctioneerId?: string;
    email?: string;
  }) {
    super(ErrorCode.AUCTIONEER_NOT_FOUND, searchCriteria);
  }
}
