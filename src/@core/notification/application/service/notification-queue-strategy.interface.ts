import { NotificationType } from './notification-type';

export default interface NotificationQueueStrategyInterface {
  execute(type: NotificationType, payload: object): Promise<void>;
}
