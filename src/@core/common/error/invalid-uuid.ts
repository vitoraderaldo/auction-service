import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidUuidError extends DomainError {
  constructor(details: {
    uuid: string;
  }) {
    super(ErrorCode.INVALID_UUID, details);
  }
}
