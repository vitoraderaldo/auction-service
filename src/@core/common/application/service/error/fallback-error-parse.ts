import ErrorCode from '../../../error/error-code';
import { ErrorParser } from './error-parser';

export default class FallbackErrorParser implements ErrorParser {
  private HTTP_STATUS = 500;

  private ERROR_CODE = ErrorCode.UNEXPECTED_ERROR;

  private EMPTY_ERROR_DETAILS = {};

  constructor(
    private readonly error: Error,
  ) {}

  getErrorCode(): string {
    return this.ERROR_CODE;
  }

  getErrorDetails(): any {
    return this.error;
  }

  getNonSensitiveErrorDetails(): any {
    return this.EMPTY_ERROR_DETAILS;
  }

  getHttpStatus(): number {
    return this.HTTP_STATUS;
  }
}
