import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import NestConfigService from '../../@core/common/infra/nest-env-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [
    {
      provide: ConfigService,
      useFactory: () => new ConfigService(),
    },
    {
      provide: 'EnvironmentConfigInterface',
      useFactory: (configService: ConfigService) => new NestConfigService(configService),
      inject: [ConfigService],
    },
  ],
  exports: ['EnvironmentConfigInterface'],
})
export default class ConfModule {}
