import { LoggerInterface } from '../../../common/application/service/logger';
import { CreditCardPayment } from '../../application/service/credit-card.payment';
import StripeCreditCardService from './stripe/stripe-credit-card.service';

export default class CreditCardPaymentFactory {
  constructor(
    private logger: LoggerInterface,
  ) {}

  create(): CreditCardPayment {
    return new StripeCreditCardService(this.logger);
  }
}
