import { Logger } from 'winston';
import { inspect } from 'util';
import { LoggerInterface } from '../application/logger';

export default class WinstonLogger implements LoggerInterface {
  constructor(
    private readonly winstonClient: Logger,
  ) {}

  info(message: string, metadata?: object): void {
    const metadataStringified = inspect(metadata);
    this.winstonClient.info(`${message} - ${metadataStringified}`);
  }

  error(message: string, metadata?: object): void {
    const metadataStringified = inspect(metadata);
    this.winstonClient.error(`${message} - ${metadataStringified}`);
  }

  warn(message: string, metadata?: object): void {
    const metadataStringified = inspect(metadata);
    this.winstonClient.warn(`${message} - ${metadataStringified}`);
  }
}
