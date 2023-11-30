import DomainError, { ErrorCode } from './domain.error';

export default class InvalidNameError extends DomainError {
  constructor(details: {
    firstName?: string;
    lastName?: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_NAME, details);
  }
}
