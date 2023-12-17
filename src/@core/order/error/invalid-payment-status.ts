import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidPaymentStatusError extends DomainError {
  constructor(details: {
    status: string;
  }) {
    super(ErrorCode.INVALID_PAYMENT_STATUS, details);
  }
}
