import { LoggerInterface } from '../../../common/application/service/logger';
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
        this.logger.error('Unknown notification type', message);
        break;
    }
    return Promise.resolve();
  }
}
