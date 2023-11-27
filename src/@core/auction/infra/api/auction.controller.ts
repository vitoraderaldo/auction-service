import {
  Body, Controller, HttpCode, Param, Post,
} from '@nestjs/common';
import CreateAuctionUseCase, { CreateAuctionOutput } from '../../application/create-auction.usecase';
import CreateAuctionRest from './payloads/create-auction';
import CreateBidRest from './payloads/create-bid';
import CreateBidUseCase, { CreateBidOutput } from '../../application/create-bid.usecase';
import PublishAuctionUseCase from '../../application/publishes-auction.usecase';

@Controller('/v1/auction')
export default class AuctionController {
  constructor(
    private readonly createAuctionUseCase: CreateAuctionUseCase,
    private readonly createBidUseCase: CreateBidUseCase,
    private readonly publishAuctionUseCase: PublishAuctionUseCase,
  ) {}

  @Post()
  async createAuction(@Body() body: CreateAuctionRest): Promise<CreateAuctionOutput> {
    const response = await this.createAuctionUseCase.execute(body);
    return response;
  }

  @Post('/:auctionId/publish')
  @HttpCode(200)
  async publishAuction(
    @Param('auctionId') auctionId: string,
  ): Promise<void> {
    await this.publishAuctionUseCase.execute({
      auctionId,
    });
  }

  @Post('/:auctionId/bid')
  async createBid(
    @Param('auctionId') auctionId: string,
      @Body() body: CreateBidRest,
  ): Promise<CreateBidOutput> {
    const response = await this.createBidUseCase.execute({
      ...body,
      auctionId,
    });
    return response;
  }
}
