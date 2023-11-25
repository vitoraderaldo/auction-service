import { Body, Controller, Post } from '@nestjs/common';
import CreateAuctionUseCase, { CreateAuctionOutput } from '../../application/create-auction.usecase';
import CreateAuctionRest from './payloads/create-auction';

@Controller('/v1/auction')
export default class AuctionController {
  constructor(private readonly createAuctionUseCase: CreateAuctionUseCase) {}

  @Post()
  async createAuction(@Body() body: CreateAuctionRest): Promise<CreateAuctionOutput> {
    const response = await this.createAuctionUseCase.execute(body);
    return response;
  }
}
