import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidNameError extends DomainError {
  constructor(details: {
    firstName?: string;
    lastName?: string;
    reason: string;
  }) {
    super(ErrorCode.INVALID_NAME, details);
  }
}
