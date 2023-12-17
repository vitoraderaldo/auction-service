import DomainError from '../../../error/domain.error';
import { ErrorParser } from './error-parser';

export default class DomainErrorParser implements ErrorParser {
  private HTTP_STATUS = 500;

  constructor(
    private readonly error: DomainError,
  ) {}

  getErrorCode(): string {
    return this.error.getErrorCode();
  }

  getErrorDetails(): any {
    return this.error.getDetails();
  }

  getNonSensitiveErrorDetails(): any {
    return this.getErrorDetails();
  }

  getHttpStatus(): number {
    return this.HTTP_STATUS;
  }
}
