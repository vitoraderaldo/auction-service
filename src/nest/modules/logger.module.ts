import { Module } from '@nestjs/common';
import LoggerFactory from '../../@core/common/infra/logger/logger-factory';
import { LoggerInterface } from '../../@core/common/application/service/logger';
import ErrorLogger from '../../@core/common/application/service/error/error-logger';

@Module({
  imports: [],
  providers: [
    {
      provide: 'LoggerInterface',
      useValue: LoggerFactory.getInstance(),
    },
    {
      provide: ErrorLogger,
      useFactory: (logger: LoggerInterface) => new ErrorLogger(logger),
      inject: ['LoggerInterface'],
    },
  ],
  exports: [
    'LoggerInterface',
    ErrorLogger,
  ],
})
export default class LoggerModule {}
