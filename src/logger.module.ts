import { Module } from '@nestjs/common';
import LoggerFactory from './@core/common/infra/logger-factory';

@Module({
  imports: [],
  providers: [
    {
      provide: 'LoggerInterface',
      useValue: LoggerFactory.getInstance(),
    },
  ],
  exports: [
    'LoggerInterface',
  ],
})
export default class LoggerModule {}
