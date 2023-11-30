import ValueObject from '../../../common/domain/value-objects/value-object';
import InvalidAuctionStatusError from '../../../common/error/invalid-auction-status';

export enum AuctionStatusEnum {
  CREATED = 'CREATED',
  PUBLISHED = 'PUBLISHED',
  BID_PERIOD_FINISHED = 'BID_PERIOD_FINISHED',
}

export default class AuctionStatus extends ValueObject<AuctionStatusEnum> {
  constructor(value: AuctionStatusEnum) {
    super(value);
    this.validate();
  }

  private validate(): void {
    if (!Object.values(AuctionStatusEnum).includes(this.value)) {
      throw new InvalidAuctionStatusError({ status: this.value });
    }
  }

  isEqualTo(other: AuctionStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value?.toString();
  }
}
