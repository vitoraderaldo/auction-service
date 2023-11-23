import { AuctionRepository } from '../domain/repositories/auction.repository';
import { AuctioneerRepository } from '../domain/repositories/auctioneer.repository';

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

export class CreateAuctionUseCase {
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

    return {
      id: auction.id.value,
      title: auction.title,
      description: auction.description,
      photos: auction.photos.map((photo) => photo.toJSON()),
      startDate: auction.startDate.value,
      endDate: auction.endDate.value,
      startPrice: auction.startPrice.value,
      currentPrice: auction.currentPrice?.value,
      status: auction.status.value,
      auctioneerId: auction.auctioneerId,
      createdAt: auction.createdAt.value,
      updatedAt: auction.updatedAt.value,
    };
  }
}
