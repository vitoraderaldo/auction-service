import ValueObject from '../../../common/domain/value-objects/value-object';

export default class AuctioneerRegistration extends ValueObject<string> {
  constructor(registration: string) {
    super(registration);
    this.validate();
  }

  validate() {
    if (this.value.length < 3) {
      throw new Error('Registration must be at least 3 characters long');
    }

    if (this.value.length === 3) {
      if (!this.value.match(/^[0-9]{3}$/)) {
        throw new Error('Registration must be a number');
      }
    } else if (!this.value.match(/^[0-9]{2}\/[0-9]{3}-[A-Z]$/)) {
      throw new Error('Registration is not in a valid format');
    }
  }

  isEqualTo(other: AuctioneerRegistration): boolean {
    return this.value === other.value;
  }
}
