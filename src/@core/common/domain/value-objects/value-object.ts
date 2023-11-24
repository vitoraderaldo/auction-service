export default abstract class ValueObject<T> {
  protected data: T;

  constructor(value: T) {
    this.data = value;
  }

  get value(): T {
    return this.data;
  }

  abstract isEqualTo(other: ValueObject<T>): boolean;
}
