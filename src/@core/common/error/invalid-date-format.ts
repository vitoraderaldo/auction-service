import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidDateFormatError extends DomainError {
  constructor(details: {
    date: string;
  }) {
    super(ErrorCode.INVALID_DATE_FORMAT, details);
  }
}
