import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidPriceError extends DomainError {
  constructor(details: {
    price: number;
    reason: string;
  }) {
    super(ErrorCode.INVALID_PRICE, details);
  }
}
