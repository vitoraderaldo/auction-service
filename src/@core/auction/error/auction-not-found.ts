import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class AuctionNotFoundError extends DomainError {
  constructor(searchCriteria: {
    auctionId: string;
  }) {
    super(ErrorCode.AUCTION_NOT_FOUND, searchCriteria);
  }
}
