import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidNotificationChannelError extends DomainError {
  constructor(details: {
    channel?: string;
  }) {
    super(ErrorCode.INVALID_NOTIFICATION_CHANNEL, details);
  }
}
