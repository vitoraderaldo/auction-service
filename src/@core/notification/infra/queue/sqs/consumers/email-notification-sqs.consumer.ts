import ErrorLogger from '../../../../../common/application/service/error/error-logger';
import EmailNotificationHandler from '../../../../application/queue-handlers/email-notiication-queue.handler';
import { SqsConsumerInterface } from '../client/sqs-consumer.interface';
import { SqsQueueName } from '../client/sqs-helper';

export default class EmailNotificationSqsQueueConsumer {
  constructor(
    sqsConsumer: SqsConsumerInterface,
    emailNotificationHandler: EmailNotificationHandler,
    errorLogger: ErrorLogger,
  ) {
    sqsConsumer.registerHandler({
      queueName: SqsQueueName.EMAIL_NOTIFICATION,
      handler: emailNotificationHandler.handle.bind(emailNotificationHandler),
      onError: (error) => errorLogger.log(error),
    });
  }
}
