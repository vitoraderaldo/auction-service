import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidEmailError extends DomainError {
  constructor(searchCriteria: {
    email: string;
  }) {
    super(ErrorCode.INVALID_EMAIL, searchCriteria);
  }
}
