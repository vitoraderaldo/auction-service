import { AuctionRepository } from '../domain/repositories/auction.repository';
import AuctioneerRepository from '../domain/repositories/auctioneer.repository';

interface InputDTO {
  auctioneerId: string;
  title: string;
  description: string;
  startPrice: number;
  startDate: string;
  endDate: string;
  photos: {
    link: string;
  }[];
}

interface OutputDTO {
  id: string;
  title: string;
  description: string;
  photos: {
    link: string;
  }[];
  startDate: string;
  endDate: string;
  startPrice: number;
  currentPrice: number;
  status: string;
  auctioneerId: string;
  createdAt: string;
  updatedAt: string;
}

export default class CreateAuctionUseCase {
  constructor(
    private readonly auctioneerRepository: AuctioneerRepository,
    private readonly auctionRepository: AuctionRepository,
  ) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const auctioneer = await this.auctioneerRepository.findById(
      input.auctioneerId,
    );

    if (!auctioneer) {
      throw new Error('Auctioneer not found');
    }

    const auction = auctioneer.createAuction({
      title: input.title,
      description: input.description,
      photos: input.photos,
      startDate: input.startDate,
      endDate: input.endDate,
      startPrice: input.startPrice,
    });

    await this.auctionRepository.save(auction);

    const auctionData = auction.toJSON();

    return {
      id: auctionData.id,
      title: auctionData.title,
      description: auctionData.description,
      photos: auctionData.photos,
      startDate: auctionData.startDate,
      endDate: auctionData.endDate,
      startPrice: auctionData.startPrice,
      currentPrice: auctionData.currentPrice,
      status: auctionData.status,
      auctioneerId: auctionData.auctioneerId,
      createdAt: auctionData.createdAt,
      updatedAt: auctionData.updatedAt,
    };
  }
}
