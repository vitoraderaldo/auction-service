import DomainError, { ErrorCode } from './domain.error';

export default class InvalidUuidError extends DomainError {
  constructor(details: {
    uuid: string;
  }) {
    super(ErrorCode.INVALID_UUID, details);
  }
}
