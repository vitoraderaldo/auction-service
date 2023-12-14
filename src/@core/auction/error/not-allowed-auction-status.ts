import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class NotAllowedInAuctionStatusError extends DomainError {
  constructor(details: {
    auctionId: string;
    status: string;
  }) {
    super(ErrorCode.NOT_ALLOWED_IN_AUCTION_STATUS, details);
  }
}
