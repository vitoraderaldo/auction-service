export interface MongoConfig {
  uri: string;
  dbName: string;
}

export interface AWSConfig {
  accountId: string;
  sqsEndpoint: string;
  region: string,
}

export type EnvironmentName = 'local' | 'develop' | 'production';

export interface EnvironmentConfigInterface {
  getMongo(): MongoConfig;
  getEnvName(): EnvironmentName;
  getAws(): AWSConfig;
}
