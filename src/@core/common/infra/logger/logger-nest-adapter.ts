import { LoggerService } from '@nestjs/common';
import { LoggerInterface } from '../../application/service/logger';

export default class NestLoggerAdapter implements LoggerService {
  constructor(
    private readonly logger: LoggerInterface,
  ) {}

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, optionalParams);
  }
}
