import { LoggerInterface } from '../../../../../common/application/service/logger';
import EmailNotificationHandler from '../../../../application/queue-handlers/email-notiication-queue.handler';
import { SqsConsumerInterface } from '../client/sqs-consumer.interface';
import { SqsQueueName } from '../client/sqs-helper';

export default class EmailNotificationSqsQueueConsumer {
  constructor(
    private readonly sqsConsumer: SqsConsumerInterface,
    private readonly emailNotificationHandler: EmailNotificationHandler,
    private readonly logger: LoggerInterface,
  ) {
    this.sqsConsumer.registerHandler({
      queueName: SqsQueueName.EMAIL_NOTIFICATION,
      handler: this.emailNotificationHandler.handle.bind(emailNotificationHandler),
      onError: (error) => this.logger.error('Failed to handle email notification from queue', error),
    });
  }
}
