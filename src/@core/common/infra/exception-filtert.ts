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
import DomainError, { ErrorCode } from '../error/domain.error';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.UNEXPECTED_ERROR;
    let errorDetails = {};

    if (exception instanceof HttpException) {
      const err = exception.getResponse() as (string | { error: string });
      const code = typeof err === 'string' ? err : err.error;
      httpStatus = exception.getStatus();
      errorCode = code?.toUpperCase() as ErrorCode;
    }

    if (exception instanceof DomainError) {
      errorCode = exception.getErrorCode();
      errorDetails = exception.getDetails();
    }

    const responseBody = {
      errorCode,
      errorDetails,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(httpStatus).json(responseBody);
  }
}
