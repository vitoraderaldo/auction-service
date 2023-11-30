import InvalidPriceError from '../../error/invalid-price';
import ValueObject from './value-object';

export default class Price extends ValueObject<number> {
  constructor(price: number) {
    super(price);
    this.validate();
  }

  validate() {
    if (typeof this.value !== 'number') {
      throw new InvalidPriceError({
        price: this.value,
        reason: 'Price must be a number',
      });
    }
    if (this.value <= 0) {
      throw new InvalidPriceError({
        price: this.value,
        reason: 'Price must be greater than 0',
      });
    }
  }

  isEqualTo(other: Price): boolean {
    return this.value === other.value;
  }

  isGreaterThan(other: Price): boolean {
    return this.value > other.value;
  }

  isGreaterThanOrEqualTo(other: Price): boolean {
    return this.value >= other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
