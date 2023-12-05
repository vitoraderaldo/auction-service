import { Producer } from 'sqs-producer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SQSClient } from '@aws-sdk/client-sqs';
import { SqsHelper, SqsQueueName } from '../sqs-helper';
import { SqsPublisher } from '../sqs-publisher.interface';

export default class SqsProducer implements SqsPublisher {
  constructor(
    private readonly sqsHelper: SqsHelper,
  ) {}

  async publish(queueName: SqsQueueName, message: {
    id: string;
    body: string;
  }): Promise<void> {
    const queueUrl = this.sqsHelper.getQueueUrl(queueName);
    const region = this.sqsHelper.getRegion();

    const producer = Producer.create({
      queueUrl,
      region,
      sqs: new SQSClient({
        endpoint: this.sqsHelper.getEndpoint(),
        region,
      }),
    });

    await producer.send(message);
  }
}
