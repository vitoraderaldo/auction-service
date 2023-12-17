import { HttpException } from '@nestjs/common';
import { ErrorParser } from '../../../application/service/error/error-parser';
import DomainError from '../../../error/domain.error';
import HttpExceptionErrorParser from './http-exception-error-parser';
import DomainErrorParser from '../../../application/service/error/domain-error-parser';
import FallbackErrorParser from '../../../application/service/error/fallback-error-parse';

export default class ErrorParserFactory {
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
