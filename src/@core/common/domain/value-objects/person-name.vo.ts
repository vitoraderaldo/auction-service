import InvalidNameError from '../../error/invalid-name';
import ValueObject from './value-object';

interface PersonNameProps {
  firstName: string;
  lastName: string;
}

export default class PersonName extends ValueObject<PersonNameProps> {
  constructor(name: PersonNameProps) {
    super(name);
    this.validate();
  }

  validate() {
    if (this.value.firstName.length < 3) {
      throw new InvalidNameError({
        firstName: this.value.firstName,
        reason: 'First name must be at least 3 characters long',
      });
    }
    if (this.value.lastName.length < 3) {
      throw new InvalidNameError({
        lastName: this.value.lastName,
        reason: 'Last name must be at least 3 characters long',
      });
    }
  }

  isEqualTo(other: PersonName): boolean {
    return (
      this.value.firstName === other.value.firstName
      && this.value.lastName === other.value.lastName
    );
  }
}
