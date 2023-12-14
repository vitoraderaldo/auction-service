import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class BidderNotFoundError extends DomainError {
  constructor(searchCriteria: {
    bidderId?: string;
    email?: string;
  }) {
    super(ErrorCode.BIDDER_NOT_FOUND, searchCriteria);
  }
}
