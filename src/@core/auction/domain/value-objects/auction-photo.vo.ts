import ValueObject from '../../../common/domain/value-objects/value-object';

export interface AuctionPhotoProps {
  link: string;
}

export default class AuctionPhoto extends ValueObject<AuctionPhotoProps> {
  constructor(value: AuctionPhotoProps) {
    super(value);
    this.validate();
  }

  private validate(): void {
    const linkPattern = 'http(s)?://(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
    const linkRegex = new RegExp(linkPattern);

    if (!linkRegex.test(this.value.link)) {
      throw new Error(`Auction photo link '${this.value.link}' is not a valid URL`);
    }
  }

  isEqualTo(other: AuctionPhoto): boolean {
    return this.value.link === other.value.link;
  }

  toJSON(): AuctionPhotoProps {
    return this.value;
  }
}
