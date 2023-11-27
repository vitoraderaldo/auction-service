import {
  IsNumber,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';

export default class CreateBidRest {
  // todo: remove this, must grab from token header
  @IsUUID()
    bidderId: string;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
    value: number;
}
