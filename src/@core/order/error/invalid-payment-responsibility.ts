import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class InvalidPaymentResponsibilityError extends DomainError {
  constructor(details: {
    responsibility: string;
  }) {
    super(ErrorCode.INVALID_PAYMENT_RESPONSIBILITY, details);
  }
}
