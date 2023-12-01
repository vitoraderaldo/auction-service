import { Body, Controller, Post } from '@nestjs/common';
import CreateAuctioneerUseCase, { CreateAuctioneerOutput } from '../../application/usecase/create-auctioneer.usecase';
import CreateAuctioneerRest from './payloads/create-auctioneer';

@Controller('/v1/auctioneer')
export default class AuctioneerController {
  constructor(private readonly createAuctioneerUseCase: CreateAuctioneerUseCase) {}

  @Post()
  async createAuctioneer(@Body() body: CreateAuctioneerRest): Promise<CreateAuctioneerOutput> {
    const response = await this.createAuctioneerUseCase.execute(body);
    return response;
  }
}
