import DomainError from '../../common/error/domain.error';
import ErrorCode from '../../common/error/error-code';

export default class OrderNotFoundError extends DomainError {
  constructor(searchCriteria: {
    orderId: string;
  }) {
    super(ErrorCode.ORDER_NOT_FOUND, searchCriteria);
  }
}
