import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidAuctionTitleError extends DomainError {
  constructor(details: {
    title: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_AUCTION_TITLE, details);
  }
}
