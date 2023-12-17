import { Logger } from 'winston';
import { inspect } from 'util';
import { LoggerInterface } from '../../../application/service/logger';

export default class WinstonLogger implements LoggerInterface {
  constructor(
    private readonly winstonClient: Logger,
  ) {}

  info(message: string, metadata?: object): void {
    const fullMessage = this.createMessage(message, metadata);
    this.winstonClient.info(fullMessage);
  }

  error(message: string, metadata?: object): void {
    const fullMessage = this.createMessage(message, metadata);
    this.winstonClient.error(fullMessage);
  }

  warn(message: string, metadata?: object): void {
    const fullMessage = this.createMessage(message, metadata);
    this.winstonClient.warn(fullMessage);
  }

  // eslint-disable-next-line class-methods-use-this
  private createMessage(message: string, metadata?: object): string {
    if (!metadata) {
      return message;
    }

    const metadataStringified = inspect(metadata, false, null, false);
    return `${message} - ${metadataStringified}`;
  }
}
