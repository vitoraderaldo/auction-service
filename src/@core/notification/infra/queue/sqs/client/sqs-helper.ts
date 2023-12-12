import { AWSConfig, EnvironmentName } from '../../../../../common/domain/environment-config.interface';

export enum SqsQueueName {
  EMAIL_NOTIFICATION = 'email-notification',
  SMS_NOTIFICATION = 'sms-notification',
}

export class SqsHelper {
  constructor(
    private readonly awsConfig: AWSConfig,
    private readonly envName: EnvironmentName,
  ) {}

  getQueueUrl(queueName: SqsQueueName): string {
    const { sqsEndpoint, accountId } = this.awsConfig;
    const { envName } = this;

    return `${sqsEndpoint}/${accountId}/${queueName}-${envName}`;
  }

  getRegion(): string {
    return this.awsConfig.region;
  }

  getEndpoint(): string {
    return this.awsConfig.sqsEndpoint;
  }
}
