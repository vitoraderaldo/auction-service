import { v4 } from 'uuid';
import { LoggerInterface } from '../../../../../common/application/service/logger';
import QueueMessagePublisher from '../../../../../common/application/service/queue-message-publisher';
import { SqsQueueName } from './sqs-helper';
import { SqsPublisher } from './sqs-publisher.interface';

export default class EmailSqsPublisher implements QueueMessagePublisher {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly sqsPublisher: SqsPublisher,
  ) {}

  async publish(payload: object): Promise<void> {
    await this.sqsPublisher.publish(SqsQueueName.EMAIL_NOTIFICATION, {
      id: v4(),
      body: JSON.stringify(payload),
    });
  }
}
