import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidNotificationTypeError extends DomainError {
  constructor(details: {
    message: any;
  }) {
    super(ErrorCode.INVALID_NOTIFICATION_TYPE, details);
  }
}
