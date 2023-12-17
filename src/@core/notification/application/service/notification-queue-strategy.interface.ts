import { NotificationType } from './notification-type';

export default interface NotificationQueueStrategyInterface {
  execute(type: NotificationType, metadata: object): Promise<void>;
}
