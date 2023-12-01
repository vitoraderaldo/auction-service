import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class EndDateBeforeStartDateError extends DomainError {
  constructor(details: {
    startDate: string;
    endDate: string;
  }) {
    super(ErrorCode.END_DATE_BEFORE_START_DATE, details);
  }
}
