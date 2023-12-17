import ValueObject from '../../../common/domain/value-objects/value-object';
import InvalidPaymentStatusError from '../../error/invalid-payment-status';

export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export default class PaymentStatus extends ValueObject<PaymentStatusEnum> {
  constructor(value: PaymentStatusEnum) {
    super(value);
    this.validate();
  }

  private validate(): void {
    if (!Object.values(PaymentStatusEnum).includes(this.value)) {
      throw new InvalidPaymentStatusError({ status: this.value });
    }
  }

  isEqualTo(other: PaymentStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value?.toString();
  }
}
