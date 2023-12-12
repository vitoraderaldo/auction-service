import { LoggerInterface } from '../../../common/application/service/logger';
import InvalidNotificationTypeError from '../../error/invalid-notification-type';
import { NotificationType } from '../service/notification-type';
import SendEmailToWinnerUseCase from '../usecase/send-email-to-winner.usecase';

export default class EmailNotificationHandler {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly sendEmailToWinnerUseCase: SendEmailToWinnerUseCase,
  ) {}

  async handle(message: {
    type: NotificationType,
    payload: any,
  }): Promise<void> {
    switch (message?.type) {
      case NotificationType.NOTIFY_WINNING_BIDDER:
        await this.sendEmailToWinnerUseCase.execute(message.payload);
        break;
      default:
        throw new InvalidNotificationTypeError({ message });
    }
  }
}
