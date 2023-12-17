/* eslint-disable class-methods-use-this */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { ErrorLogger, ErrorParserFactory } from './error-parser';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly errorLogger: ErrorLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errorParser = ErrorParserFactory.create(exception);

    const errorCode = errorParser.getErrorCode();
    const errorDetails = errorParser.getNonSensitiveErrorDetails();
    const httpStatus = errorParser.getHttpStatus();

    this.errorLogger.log(exception);

    const responseBody = {
      errorCode,
      errorDetails,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(httpStatus).json(responseBody);
  }
}
