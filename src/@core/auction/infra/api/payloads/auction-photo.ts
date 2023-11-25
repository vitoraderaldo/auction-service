import { IsNotEmpty, IsUrl } from 'class-validator';

export default class AuctionPhoto {
  @IsUrl()
  @IsNotEmpty()
    link: string;
}
