import {
  Body, Controller, Post,
} from '@nestjs/common';
import CreateBidderUseCase, { CreateBidderOutput } from '../../../application/usecase/create-bidder.usecase';
import CreateBidderRest from './payloads/create-bidder';

@Controller('/v1/bidder')
export default class BidderController {
  constructor(
    private readonly createBidderUseCase: CreateBidderUseCase,
  ) {}

  @Post()
  async createBidder(@Body() body: CreateBidderRest): Promise<CreateBidderOutput> {
    return this.createBidderUseCase.execute(body);
  }
}
