import { LoggerInterface } from '../../../../common/application/service/logger';
import { CreditCardPayment } from '../../../application/service/credit-card.payment';

export default class StripeCreditCardService implements CreditCardPayment {
  constructor(
    private logger: LoggerInterface,
  ) {}

  pay(): Promise<void> {
    this.logger.info('Starting payment process with Stripe');
    return Promise.resolve();
  }
}
