export interface MongoConfig {
  uri: string;
  dbName: string;
}

export interface AWSConfig {
  accountId: string;
  sqsEndpoint: string;
  region: string,
}

export interface SendGridTemplates {
  notifyWinningBidder: string;
  paymentRequestForAuction: string;
}

export interface SendGridConfig {
  baseUrl: string;
  apiKey: string;
  templates: SendGridTemplates
}

export type EnvironmentName = 'local' | 'develop' | 'production';

export interface EnvironmentConfigInterface {
  getMongo(): MongoConfig;
  getEnvName(): EnvironmentName;
  getAws(): AWSConfig;
  getSendGrid(): SendGridConfig;
  getDefaultSenderEmail(): string;
}
