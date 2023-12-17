import { v4 } from 'uuid';
import QueueMessagePublisher from '../../../../../common/application/service/queue-message-publisher';
import { SqsPublisher } from '../../../../../notification/infra/queue/sqs/client/sqs-publisher.interface';
import { SqsQueueName } from '../../../../../notification/infra/queue/sqs/client/sqs-helper';

export default class OrderSqsPublisher implements QueueMessagePublisher {
  constructor(
    private readonly sqsPublisher: SqsPublisher,
  ) {}

  async publish(payload: object): Promise<void> {
    await this.sqsPublisher.publish(SqsQueueName.ORDER, {
      id: v4(),
      body: JSON.stringify(payload),
    });
  }
}
