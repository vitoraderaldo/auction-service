import DomainError, { ErrorCode } from './domain.error';

export default class InvalidEmailError extends DomainError {
  constructor(searchCriteria: {
    email: string;
  }) {
    super(ErrorCode.INVALID_EMAIL, searchCriteria);
  }
}
