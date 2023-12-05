/* eslint-disable class-methods-use-this */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { LoggerInterface } from '../application/service/logger';
import ErrorCode from '../error/error-code';
import DomainError from '../error/domain.error';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly loggerInterface: LoggerInterface,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let body: {
      errorCode: ErrorCode;
      errorDetails: object;
      httpStatus: HttpStatus;
    };

    switch (true) {
      case exception instanceof HttpException:
        body = this.createResponseForHttpException(exception as HttpException);
        this.loggerInterface.error(body.errorCode, body.errorDetails);
        break;
      case exception instanceof DomainError:
        body = this.createResponseForDomainError(exception as DomainError);
        this.loggerInterface.warn(body.errorCode, body.errorDetails);
        break;
      default:
        body = this.createResponseForUnexpectedError();
        this.loggerInterface.error('', exception as object);
    }

    const responseBody = {
      errorCode: body.errorCode,
      errorDetails: body.errorDetails,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(body.httpStatus).json(responseBody);
  }

  private createResponseForHttpException(
    exception: HttpException,
  ) {
    const err = exception.getResponse() as (string | { error: string });
    const code = typeof err === 'string' ? err : err.error;
    const httpStatus = exception.getStatus() as HttpStatus;
    const errorCode = code?.toUpperCase() as ErrorCode;

    return {
      errorCode,
      errorDetails: {
        reason: exception.message,
      },
      httpStatus,
    };
  }

  private createResponseForDomainError(
    error: DomainError,
  ) {
    return {
      errorCode: error.getErrorCode(),
      errorDetails: error.getDetails(),
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  private createResponseForUnexpectedError() {
    return {
      errorCode: ErrorCode.UNEXPECTED_ERROR,
      errorDetails: {},
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}
