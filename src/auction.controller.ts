import { Controller, Post } from '@nestjs/common';
import CreateAuctionUseCase from './@core/auction/application/create-auction.usecase';

@Controller('/v1/auction')
export default class AuctionController {
  constructor(
    private readonly createAuctionUseCase: CreateAuctionUseCase,
  ) {}

  @Post()
  async createAuction() {
    const response = await this.createAuctionUseCase.execute({
      auctioneerId: '123',
      title: 'title',
      description: 'description',
      startPrice: 105.4,
      startDate: '2021-01-01',
      endDate: '2021-01-02',
      photos: [],
    });

    return response;
  }
}
