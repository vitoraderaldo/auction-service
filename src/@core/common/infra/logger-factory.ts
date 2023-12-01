import { LoggerInterface } from '../application/service/logger';
import winstonClient from './winston-client';
import WinstonLogger from './winston-logger';

export default class LoggerFactory {
  static getInstance(): LoggerInterface {
    return new WinstonLogger(winstonClient);
  }
}
