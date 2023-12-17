import InvalidPaymentStatusError from '../../error/invalid-payment-status';
import PaymentStatus, { PaymentStatusEnum } from './payment-status.vo';

describe('PaymentStatus', () => {
  it('should create a PaymentStatus instance with a valid status', () => {
    const validStatus = PaymentStatusEnum.PAID;
    const paymentStatus = new PaymentStatus(validStatus);
    expect(paymentStatus.toString()).toBe(validStatus);
  });

  it('should throw InvalidPaymentStatusError for an invalid status', () => {
    const invalidStatus = 'INVALID_STATUS' as PaymentStatusEnum;
    expect(() => new PaymentStatus(invalidStatus)).toThrow(InvalidPaymentStatusError);
  });

  it('should correctly check equality between two PaymentStatus instances', () => {
    const status1 = new PaymentStatus(PaymentStatusEnum.PENDING);
    const status2 = new PaymentStatus(PaymentStatusEnum.PENDING);
    const status3 = new PaymentStatus(PaymentStatusEnum.PAID);

    expect(status1.isEqualTo(status2)).toBe(true);
    expect(status1.isEqualTo(status3)).toBe(false);
  });
});
