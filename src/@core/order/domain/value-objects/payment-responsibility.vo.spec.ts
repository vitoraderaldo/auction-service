import InvalidPaymentResponsibilityError from '../../error/invalid-payment-responsibility';
import PaymentResponsibility, { PaymentResponsibilityEnum } from './payment-responsibility.vo';

describe('PaymentResponsibility', () => {
  it('should create a PaymentResponsibility instance with a valid responsibility', () => {
    const validResponsibility = PaymentResponsibilityEnum.AUCTIONEER;
    const paymentResponsibility = new PaymentResponsibility(validResponsibility);
    expect(paymentResponsibility.toString()).toBe(validResponsibility);
  });

  it('should throw InvalidPaymentResponsibilityError for an invalid responsibility', () => {
    const invalidResponsibility = 'INVALID_RESPONSIBILITY' as PaymentResponsibilityEnum;
    expect(() => new PaymentResponsibility(invalidResponsibility))
      .toThrow(InvalidPaymentResponsibilityError);
  });

  it('should correctly check equality between two PaymentResponsibility instances', () => {
    const responsibility1 = new PaymentResponsibility(PaymentResponsibilityEnum.AUCTIONEER);
    const responsibility2 = new PaymentResponsibility(PaymentResponsibilityEnum.AUCTIONEER);
    const responsibility3 = new PaymentResponsibility(PaymentResponsibilityEnum.SYSTEM);

    expect(responsibility1.isEqualTo(responsibility2)).toBe(true);
    expect(responsibility1.isEqualTo(responsibility3)).toBe(false);
  });
});
