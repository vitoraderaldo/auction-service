import { ConfigService } from '@nestjs/config';
import {
  AWSConfig,
  EnvironmentConfigInterface,
  EnvironmentName,
  MongoConfig,
} from '../domain/environment-config.interface';

export default class NestConfigService implements EnvironmentConfigInterface {
  constructor(private readonly nestConfig: ConfigService) {}

  getAws(): AWSConfig {
    return {
      sqsEndpoint: this.nestConfig.get('AWS_SQS_ENDPOINT'),
      accountId: this.nestConfig.get('AWS_ACCOUNT_ID'),
      region: this.nestConfig.get('AWS_REGION'),
    };
  }

  getEnvName(): EnvironmentName {
    return this.nestConfig.get('ENV');
  }

  getMongo(): MongoConfig {
    return {
      uri: this.nestConfig.get('MONGO_URI'),
      dbName: this.nestConfig.get('MONGO_DB_NAME'),
    };
  }
}
