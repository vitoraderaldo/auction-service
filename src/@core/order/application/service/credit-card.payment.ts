export interface CreditCardPayment {
  pay(): Promise<void>;
}
