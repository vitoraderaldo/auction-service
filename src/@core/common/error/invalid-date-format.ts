import DomainError, { ErrorCode } from './domain.error';

export default class InvalidDateFormatError extends DomainError {
  constructor(details: {
    date: string;
  }) {
    super(ErrorCode.INVALID_DATE_FORMAT, details);
  }
}
