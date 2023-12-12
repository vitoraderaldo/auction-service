import { SqsQueueName } from './sqs-helper';

export interface SqsConsumerInterface {
  registerHandler(params: {
    queueName: SqsQueueName,
    handler: (message: string) => Promise<void>,
    onError?: (error: Error) => void,
  }): void;
}
