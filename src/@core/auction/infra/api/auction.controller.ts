import {
  Body, Controller, HttpCode, Param, Post, UseGuards,
} from '@nestjs/common';
import CreateAuctionUseCase, { CreateAuctionOutput } from '../../application/usecase/create-auction.usecase';
import CreateAuctionRest from './payloads/create-auction';
import CreateBidRest from './payloads/create-bid';
import CreateBidUseCase, { CreateBidOutput } from '../../application/usecase/create-bid.usecase';
import PublishAuctionUseCase from '../../application/usecase/publishes-auction.usecase';
import AuctioneerGuard from '../../../common/infra/api/guards/auctioneer.guard';
import BidderGuard from '../../../common/infra/api/guards/bidder.guard';
import { AuctioneerId, BidderId } from '../../../common/infra/api/guards/user.decorators';
import SystemGuard from '../../../common/infra/api/guards/system.guard';
import BidPeriodHasFinishedUseCase, { BidPeriodHasFinishedOutput } from '../../application/usecase/bid-period-has-finished.usecase';

@Controller('/v1/auction')
export default class AuctionController {
  constructor(
    private readonly createAuctionUseCase: CreateAuctionUseCase,
    private readonly createBidUseCase: CreateBidUseCase,
    private readonly publishAuctionUseCase: PublishAuctionUseCase,
    private readonly bidPeriodHasFinishedUseCase: BidPeriodHasFinishedUseCase,
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

  @UseGuards(SystemGuard)
  @Post('/change-status')
  @HttpCode(200)
  async changeStatus(): Promise<BidPeriodHasFinishedOutput> {
    const response = await this.bidPeriodHasFinishedUseCase.execute();
    return response;
  }
}
