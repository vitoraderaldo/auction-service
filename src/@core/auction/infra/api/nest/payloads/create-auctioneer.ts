import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class CreateAuctioneerRest {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
    firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
    lastName: string;

  @IsEmail()
  @MinLength(3)
  @MaxLength(50)
    email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(10)
    registration: string;
}
