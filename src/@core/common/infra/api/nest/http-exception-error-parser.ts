import { HttpException } from '@nestjs/common';
import { ErrorParser } from '../../../application/service/error/error-parser';

export default class HttpExceptionErrorParser implements ErrorParser {
  constructor(
    private readonly exception: HttpException,
  ) {}

  getErrorCode(): string {
    const err = this.exception.getResponse() as (string | { error: string });
    const code = typeof err === 'string' ? err : err.error;
    return code?.toUpperCase();
  }

  getErrorDetails(): any {
    return {
      reason: this.exception.message,
    };
  }

  getNonSensitiveErrorDetails(): any {
    return this.getErrorDetails();
  }

  getHttpStatus(): number {
    return this.exception.getStatus();
  }
}
