import ValueObject from '../../../common/domain/value-objects/value-object';
import InvalidPaymentResponsibilityError from '../../error/invalid-payment-responsibility';

export enum PaymentResponsibilityEnum {
  AUCTIONEER = 'AUCTIONEER',
  SYSTEM = 'SYSTEM',
}

export default class PaymentResponsibility extends ValueObject<PaymentResponsibilityEnum> {
  constructor(value: PaymentResponsibilityEnum) {
    super(value);
    this.validate();
  }

  private validate(): void {
    if (!Object.values(PaymentResponsibilityEnum).includes(this.value)) {
      throw new InvalidPaymentResponsibilityError({ responsibility: this.value });
    }
  }

  isEqualTo(other: PaymentResponsibility): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value?.toString();
  }
}
