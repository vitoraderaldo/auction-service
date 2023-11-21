import { ValueObject } from '../../../common/domain/value-objects/value-object';

export class Price extends ValueObject<number> {
  constructor(price: number) {
    super(price);
    this.validate();
  }

  validate() {
    if (typeof this.value !== 'number') {
      throw new Error('Price must be a number');
    }
    if (this.value <= 0) {
      throw new Error('Price must be greater than 0');
    }
  }

  isEqualTo(other: Price): boolean {
    return this.value === other.value;
  }
}
