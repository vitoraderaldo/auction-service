import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidOrderMessageTypeError extends DomainError {
  constructor(details: {
    message: any;
  }) {
    super(ErrorCode.INVALID_ORDER_MESSAGE_TYPE, details);
  }
}
