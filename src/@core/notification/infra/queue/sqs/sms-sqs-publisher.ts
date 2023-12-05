import { randomUUID } from 'crypto';
import { LoggerInterface } from '../../../../common/application/service/logger';
import QueueMessagePublisher from '../../../../common/application/service/queue-message-publisher';
import { SqsQueueName } from './sqs-helper';
import { SqsPublisher } from './sqs-publisher.interface';

export default class SmsSqsPublisher implements QueueMessagePublisher {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly sqsPublisher: SqsPublisher,
  ) {}

  async publish(payload: object): Promise<void> {
    this.logger.info(`Publishing to sms sqs queue: ${JSON.stringify(payload)}`);

    await this.sqsPublisher.publish(SqsQueueName.SMS_NOTIFICATION, {
      id: randomUUID(),
      body: JSON.stringify(payload),
    });
  }
}
