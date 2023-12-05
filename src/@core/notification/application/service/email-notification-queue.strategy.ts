import NotificationQueueStrategyInterface from './notification-queue-strategy.interface';
import QueueMessagePublisher from '../../../common/application/service/queue-message-publisher';
import { NotificationType } from './notification-type';

export default class EmailNotificationQueueStrategy implements NotificationQueueStrategyInterface {
  constructor(private emailQueue: QueueMessagePublisher) {}

  async execute(type: NotificationType, payload: object): Promise<void> {
    await this.emailQueue.publish({
      type,
      payload,
    });
  }
}
