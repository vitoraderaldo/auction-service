import { ValueObject } from '../../../common/domain/value-objects/value-object';

export class Email extends ValueObject<string> {
  constructor(registration: string) {
    super(registration);
    this.validate();
  }

  validate() {
    const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    if (!regex.test(this.value)) {
      throw new Error('Email is not in a valid format');
    }
  }

  isEqualTo(other: Email): boolean {
    return this.value === other.value;
  }
}
