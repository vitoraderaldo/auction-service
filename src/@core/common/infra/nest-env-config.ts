import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigInterface, MongoConfig } from '../domain/environment-config.interface';

export default class NestConfigService implements EnvironmentConfigInterface {
  constructor(private readonly nestConfig: ConfigService) {}

  getMongo(): MongoConfig {
    return {
      uri: this.nestConfig.get('MONGO_URI'),
      dbName: this.nestConfig.get('MONGO_DB_NAME'),
    };
  }
}
