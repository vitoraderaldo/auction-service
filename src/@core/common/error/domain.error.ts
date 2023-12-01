import ErrorCode from './error-code';

export default class DomainError extends Error {
  constructor(
    private code: ErrorCode,
    private details: object,
  ) {
    super(code);
  }

  getErrorCode(): ErrorCode {
    return this.code;
  }

  getDetails(): object {
    return this.details;
  }
}
