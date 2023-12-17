import { inspect } from 'util';
import { LoggerInterface } from '../logger';
import ErrorParserFactory from '../../../infra/api/nest/error-parser-factory';
import FallbackErrorParser from './fallback-error-parse';

export default class ErrorLogger {
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
