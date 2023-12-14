import ValueObject from '../../../common/domain/value-objects/value-object';
import InvalidAuctioneerRegistrationError from '../../error/invalid-registration';

export default class AuctioneerRegistration extends ValueObject<string> {
  constructor(registration: string) {
    super(registration);
    this.validate();
  }

  validate() {
    if (this.value.length < 3) {
      throw new InvalidAuctioneerRegistrationError({
        value: this.value,
        reason: 'Registration must be at least 3 characters long',
      });
    }

    if (this.value.length === 3) {
      if (!this.value.match(/^\d{3}$/)) {
        throw new InvalidAuctioneerRegistrationError({
          value: this.value,
          reason: 'Registration with 3 characters must be a number',
        });
      }
    } else if (!this.value.match(/^\d{2}\/\d{3}-[A-Z]$/)) {
      throw new InvalidAuctioneerRegistrationError({
        value: this.value,
        reason: 'Registration is not in a valid format',
      });
    }
  }

  isEqualTo(other: AuctioneerRegistration): boolean {
    return this.value === other.value;
  }
}
