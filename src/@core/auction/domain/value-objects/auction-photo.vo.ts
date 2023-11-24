import { ValueObject } from '../../../common/domain/value-objects/value-object';

export interface AuctionPhotoProps {
  link: string;
}

export class AuctionPhoto extends ValueObject<AuctionPhotoProps> {
  constructor(value: AuctionPhotoProps) {
    super(value);
    this.validate();
  }

  private validate(): void {
    const secureLinkRegex =
      /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

    if (!secureLinkRegex.test(this.value.link)) {
      throw new Error('Auction photo link must be a valid secure URL');
    }
  }

  isEqualTo(other: AuctionPhoto): boolean {
    return this.value.link === other.value.link;
  }

  toJSON(): AuctionPhotoProps {
    return this.value;
  }
}
