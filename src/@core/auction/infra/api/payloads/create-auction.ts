import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import AuctionPhoto from './auction-photo';

export default class CreateAuctionRest {
  @IsUUID()
    auctioneerId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
    title: string;

  @IsString()
  @MinLength(7)
  @MaxLength(10000)
    description: string;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
    startPrice: number;

  @IsDateString()
    startDate: string;

  @IsDateString()
    endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuctionPhoto)
    photos: AuctionPhoto[];
}
