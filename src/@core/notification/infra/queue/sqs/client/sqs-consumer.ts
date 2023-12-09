import { Consumer } from 'sqs-consumer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SQSClient } from '@aws-sdk/client-sqs';
import { SqsConsumerInterface } from './sqs-consumer.interface';
import { SqsHelper, SqsQueueName } from './sqs-helper';

export default class SqsConsumer implements SqsConsumerInterface {
  constructor(
    private readonly sqsHelper: SqsHelper,
  ) {}

  registerHandler(params: {
    queueName: SqsQueueName,
    handler: (message: string) => Promise<void>,
    onError?: (error: Error) => Promise<void>,
  }): void {
    const { queueName, handler: messageHandler, onError } = params;
    const queueUrl = this.sqsHelper.getQueueUrl(queueName);

    const app = Consumer.create({
      queueUrl,
      sqs: new SQSClient({
        endpoint: this.sqsHelper.getEndpoint(),
        region: this.sqsHelper.getRegion(),
      }),
      handleMessage: (message) => messageHandler(JSON.parse(message.Body || '')),
    });

    if (onError) {
      app.on('processing_error', onError);
    }

    app.start();
  }
}
