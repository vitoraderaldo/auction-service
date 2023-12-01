import DomainError, { ErrorCode } from './domain.error';

export default class NotAllowedInAuctionStatusError extends DomainError {
  constructor(details: {
    auctionId: string;
    status: string;
  }) {
    super(ErrorCode.NOT_ALLOWED_IN_AUCTION_STATUS, details);
  }
}
