/* eslint-disable max-classes-per-file */
import { HttpException } from '@nestjs/common';
import { inspect } from 'util';
import DomainError from '../../../error/domain.error';
import ErrorCode from '../../../error/error-code';
import { LoggerInterface } from '../../../application/service/logger';

// todo: move every class/interface to its own file

export interface ErrorParser {
  getErrorCode(): string;
  getErrorDetails(): any;
  getNonSensitiveErrorDetails(): any;
  getHttpStatus(): number;
}

export class HttpExceptionErrorParser implements ErrorParser {
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

export class DomainErrorParser implements ErrorParser {
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

  // eslint-disable-next-line class-methods-use-this
  getHttpStatus(): number {
    return 500;
  }
}

export class FallbackErrorParser implements ErrorParser {
  constructor(
    private readonly error: Error,
  ) {}

  // eslint-disable-next-line class-methods-use-this
  getErrorCode(): string {
    return ErrorCode.UNEXPECTED_ERROR;
  }

  getErrorDetails(): any {
    return this.error;
  }

  // eslint-disable-next-line class-methods-use-this
  getNonSensitiveErrorDetails(): any {
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  getHttpStatus(): number {
    return 500;
  }
}

export class ErrorParserFactory {
  static create(error: any): ErrorParser {
    if (error instanceof HttpException) {
      return new HttpExceptionErrorParser(error);
    }

    if (error instanceof DomainError) {
      return new DomainErrorParser(error);
    }

    return new FallbackErrorParser(error as Error);
  }
}

export class ErrorLogger {
  constructor(
    private readonly logger: LoggerInterface,
  ) {}

  log(error: any) {
    const errorParser = ErrorParserFactory.create(error);

    if (errorParser instanceof FallbackErrorParser) {
      this.logger.error(inspect(error, false, null, false));
      return;
    }

    const errorCode = errorParser.getErrorCode();
    const errorDetails = errorParser.getErrorDetails();
    this.logger.warn(errorCode, errorDetails);
  }
}
