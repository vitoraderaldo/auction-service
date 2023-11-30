import DomainError, { ErrorCode } from './domain.error';

export default class DateInThePastError extends DomainError {
  constructor(details: {
    date?: string;
    field?: string;
  }) {
    super(ErrorCode.DATE_IN_THE_PAST, details);
  }
}
