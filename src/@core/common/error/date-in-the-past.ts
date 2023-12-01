import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class DateInThePastError extends DomainError {
  constructor(details: {
    date?: string;
    field?: string;
  }) {
    super(ErrorCode.DATE_IN_THE_PAST, details);
  }
}
