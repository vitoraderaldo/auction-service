import { ValueObject } from '../../../common/domain/value-objects/value-object';

export class IsoStringDate extends ValueObject<string> {
  constructor(date: string) {
    super(date);
    this.validate();
  }

  validate() {
    const regex =
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    if (!regex.test(this.value)) {
      throw new Error('Invalid ISO string date');
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
}
