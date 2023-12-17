import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidOrderTypeError extends DomainError {
  constructor(details: {
    message: any;
  }) {
    super(ErrorCode.INVALID_ORDER_TYPE, details);
  }
}
