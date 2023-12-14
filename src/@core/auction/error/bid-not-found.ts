import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class BidNotFoundError extends DomainError {
  constructor(searchCriteria: {
    bidId: string;
  }) {
    super(ErrorCode.BID_NOT_FOUND, searchCriteria);
  }
}
