import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidAuctioneerRegistrationError extends DomainError {
  constructor(details: {
    value: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_AUCTIONEER_REGISTRATION, details);
  }
}
