import InvalidNotificationChannelError from '../../error/invalid-notification-channel';
import EmailNotificationQueueStrategy from './email-notification-queue.strategy';
import NotificationQueueStrategyInterface from './notification-queue-strategy.interface';
import { NotificationChannel } from './notification-type';
import SmsNotificationQueueStrategy from './sms-notification-queue.strategy';

export default class NotificationStrategyFactory {
  constructor(
    private emailStrategy: EmailNotificationQueueStrategy,
    private smsStrategy: SmsNotificationQueueStrategy,
  ) {}

  getStrategy(channel: NotificationChannel): NotificationQueueStrategyInterface {
    switch (channel) {
      case NotificationChannel.EMAIL:
        return this.emailStrategy;
      case NotificationChannel.SMS:
        return this.smsStrategy;
      default:
        throw new InvalidNotificationChannelError({ channel });
    }
  }
}
