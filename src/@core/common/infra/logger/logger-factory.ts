import { LoggerInterface } from '../../application/service/logger';
import winstonClient from './winston/winston-client';
import WinstonLogger from './winston/winston-logger';

export default class LoggerFactory {
  static getInstance(): LoggerInterface {
    return new WinstonLogger(winstonClient);
  }
}
