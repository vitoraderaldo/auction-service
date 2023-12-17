import ErrorLogger from '../../../../../common/application/service/error/error-logger';
import { SqsConsumerInterface } from '../../../../../notification/infra/queue/sqs/client/sqs-consumer.interface';
import { SqsQueueName } from '../../../../../notification/infra/queue/sqs/client/sqs-helper';
import OrderQueueHandler from '../../../../application/queue-handlers/order-queue.handler';

export default class OrderSqsQueueConsumer {
  constructor(
    sqsConsumer: SqsConsumerInterface,
    errorLogger: ErrorLogger,
    orderQueueHandler: OrderQueueHandler,
  ) {
    sqsConsumer.registerHandler({
      queueName: SqsQueueName.ORDER,
      handler: orderQueueHandler.handle.bind(orderQueueHandler),
      onError: (error) => errorLogger.log(error),
    });
  }
}
