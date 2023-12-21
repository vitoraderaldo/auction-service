import { ConfigService } from '@nestjs/config';
import {
  AWSConfig,
  EnvironmentConfigInterface,
  EnvironmentName,
  MongoConfig,
  SendGridConfig,
  StripeConfig,
} from '../../../application/service/environment-config.interface';

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

  getSendGrid(): SendGridConfig {
    return {
      apiKey: this.nestConfig.get('SENDGRID_API_KEY'),
      baseUrl: this.nestConfig.get('SENDGRID_BASE_URL'),
      templates: {
        notifyWinningBidder: this.nestConfig.get('SENDGRID_TEMPLATE_NOTIFY_WINNING_BIDDER'),
        paymentRequestForAuction: this.nestConfig.get('SENDGRID_TEMPLATE_PAYMENT_REQUEST_FOR_AUCTION'),
      },
    };
  }

  getDefaultSenderEmail(): string {
    return this.nestConfig.get('DEFAULT_SENDER_EMAIL');
  }

  getStripeConfig(): StripeConfig {
    return {
      url: this.nestConfig.get('STRIPE_URL'),
      secretKey: this.nestConfig.get('STRIPE_SECRET_KEY'),
    };
  }
}
