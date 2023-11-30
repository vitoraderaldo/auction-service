import DomainError, { ErrorCode } from './domain.error';

export default class EndDateBeforeStartDateError extends DomainError {
  constructor(details: {
    startDate: string;
    endDate: string;
  }) {
    super(ErrorCode.END_DATE_BEFORE_START_DATE, details);
  }
}
