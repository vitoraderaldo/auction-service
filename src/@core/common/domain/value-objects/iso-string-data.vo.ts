import InvalidDateFormatError from '../../error/invalid-date-format';
import ValueObject from './value-object';

export default class IsoStringDate extends ValueObject<string> {
  constructor(date: string) {
    super(date);
    this.validate();
  }

  validate() {
    const regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    if (!regex.test(this.value)) {
      throw new InvalidDateFormatError({ date: this.value });
    }
  }

  isEqualTo(other: IsoStringDate): boolean {
    return this.value === other.value;
  }

  isBefore(other: IsoStringDate): boolean {
    const thisDate = new Date(this.value);
    const otherDate = new Date(other.value);
    return thisDate < otherDate;
  }

  isAfter(other: IsoStringDate): boolean {
    const thisDate = new Date(this.value);
    const otherDate = new Date(other.value);
    return thisDate > otherDate;
  }
}
