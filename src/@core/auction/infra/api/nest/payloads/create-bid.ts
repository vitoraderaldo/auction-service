import {
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';

export default class CreateBidRest {
  @IsNumber()
  @IsPositive()
  @Min(0.01)
    value: number;
}
