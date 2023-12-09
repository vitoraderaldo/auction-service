import { SqsQueueName } from './sqs-helper';

export interface SqsPublisher {
  publish(queueName: SqsQueueName, message: {
    id: string;
    body: string;
  }): Promise<void>;
}
