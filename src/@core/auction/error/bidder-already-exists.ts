import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class BidderAlreadyExistsError extends DomainError {
  constructor(searchCriteria: {
    email?: string;
  }) {
    super(ErrorCode.BIDDER_ALREADY_EXISTS, searchCriteria);
  }
}
