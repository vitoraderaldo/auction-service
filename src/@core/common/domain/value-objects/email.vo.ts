import ValueObject from './value-object';

export default class Email extends ValueObject<string> {
  constructor(registration: string) {
    super(registration);
    this.validate();
  }

  validate() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(this.value)) {
      throw new Error(`Email ${this.value} is not in a valid format`);
    }
  }

  isEqualTo(other: Email): boolean {
    return this.value === other.value;
  }
}
