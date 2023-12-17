import NotificationQueueStrategyInterface from '../notification-queue-strategy.interface';
import QueueMessagePublisher from '../../../../common/application/service/queue-message-publisher';
import { NotificationType } from '../notification-type';

export default class SmsNotificationQueueStrategy implements NotificationQueueStrategyInterface {
  constructor(private smsQueue: QueueMessagePublisher) {}

  async execute(type: NotificationType, metadata: object): Promise<void> {
    await this.smsQueue.publish({
      type,
      payload: metadata,
    });
  }
}
