export abstract class ValueObject<T> {
  protected _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  abstract isEqualTo(other: ValueObject<T>): boolean;
}
