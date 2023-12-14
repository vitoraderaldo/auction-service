import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidBidPeriodError extends DomainError {
  constructor(details: {
    auctionId: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_BID_PERIOD, details);
  }
}
