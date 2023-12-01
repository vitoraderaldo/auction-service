import DomainError, { ErrorCode } from './domain.error';

export default class InvalidAuctioneerRegistrationError extends DomainError {
  constructor(details: {
    value: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_AUCTIONEER_REGISTRATION, details);
  }
}
