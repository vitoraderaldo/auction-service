import {
  Body, Controller, HttpCode, Param, Post, UseGuards,
} from '@nestjs/common';
import CreateAuctionUseCase, { CreateAuctionOutput } from '../../application/create-auction.usecase';
import CreateAuctionRest from './payloads/create-auction';
import CreateBidRest from './payloads/create-bid';
import CreateBidUseCase, { CreateBidOutput } from '../../application/create-bid.usecase';
import PublishAuctionUseCase from '../../application/publishes-auction.usecase';
import AuctioneerGuard from '../../../common/infra/api/guards/auctioneer.guard';
import BidderGuard from '../../../common/infra/api/guards/bidder.guard';
import { AuctioneerId, BidderId } from '../../../common/infra/api/guards/user.decorators';

@Controller('/v1/auction')
export default class AuctionController {
  constructor(
    private readonly createAuctionUseCase: CreateAuctionUseCase,
    private readonly createBidUseCase: CreateBidUseCase,
    private readonly publishAuctionUseCase: PublishAuctionUseCase,
  ) {}

  @UseGuards(AuctioneerGuard)
  @Post()
  async createAuction(
    @AuctioneerId() auctioneerId: string,
      @Body() body: CreateAuctionRest,
  ): Promise<CreateAuctionOutput> {
    const response = await this.createAuctionUseCase.execute({
      ...body,
      auctioneerId,
    });
    return response;
  }

  @UseGuards(AuctioneerGuard)
  @Post('/:auctionId/publish')
  @HttpCode(200)
  async publishAuction(
    @AuctioneerId() auctioneerId: string,
      @Param('auctionId') auctionId: string,
  ): Promise<void> {
    await this.publishAuctionUseCase.execute({
      auctionId,
      auctioneerId,
    });
  }

  @UseGuards(BidderGuard)
  @Post('/:auctionId/bid')
  async createBid(
    @BidderId() bidderId: string,
      @Param('auctionId') auctionId: string,
      @Body() body: CreateBidRest,
  ): Promise<CreateBidOutput> {
    const response = await this.createBidUseCase.execute({
      ...body,
      auctionId,
      bidderId,
    });
    return response;
  }
}
