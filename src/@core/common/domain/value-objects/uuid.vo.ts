import { randomUUID } from 'crypto';
import ValueObject from './value-object';
import InvalidUuidError from '../../error/invalid-uuid';

export default class Uuid extends ValueObject<string> {
  constructor(value?: string) {
    const uuid = value || randomUUID();
    super(uuid);
    this.validate();
  }

  isEqualTo(other: Uuid): boolean {
    return this.value === other.value;
  }

  private validate() {
    const uuidRegex = /^((([a-f\d]{8})((-[a-f\d]{4}){3})-([a-f\d]{12}))|(([a-f\d])){32})$/i;
    if (!uuidRegex.test(this.value)) {
      throw new InvalidUuidError({ uuid: this.value });
    }
  }
}
