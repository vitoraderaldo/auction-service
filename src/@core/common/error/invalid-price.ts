import DomainError, { ErrorCode } from './domain.error';

export default class InvalidPriceError extends DomainError {
  constructor(details: {
    price: number;
    reason: string;
  }) {
    super(ErrorCode.INVALID_PRICE, details);
  }
}
