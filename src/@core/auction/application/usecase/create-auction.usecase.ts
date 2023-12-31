import { LoggerInterface } from '../../../common/application/service/logger';
import AuctioneerNotFoundError from '../../error/auctioneer-not-found';
import { AuctionRepository } from '../../domain/repositories/auction.repository';
import AuctioneerRepository from '../../domain/repositories/auctioneer.repository';

interface CreateAuctionInput {
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

export interface CreateAuctionOutput {
  id: string;
  title: string;
  description: string;
  photos: {
    link: string;
  }[];
  startDate: string;
  endDate: string;
  startPrice: number;
  status: string;
  auctioneerId: string;
  createdAt: string;
  updatedAt: string;
}

export default class CreateAuctionUseCase {
  constructor(
    private readonly auctionRepository: AuctionRepository,
    private readonly auctioneerRepository: AuctioneerRepository,
    private readonly logger: LoggerInterface,
  ) {}

  async execute(input: CreateAuctionInput): Promise<CreateAuctionOutput> {
    const { auctioneerId, title, startPrice } = input;
    this.logger.info(`Starting to create auction for auctioneerId (${auctioneerId}), title (${title}) and startPrice (${startPrice})`);
    const auctioneer = await this.auctioneerRepository.findById(
      input.auctioneerId,
    );

    if (!auctioneer) {
      throw new AuctioneerNotFoundError({ auctioneerId });
    }

    const auction = auctioneer.createAuction({
      title: input.title,
      description: input.description,
      photos: input.photos,
      startDate: input.startDate,
      endDate: input.endDate,
      startPrice: input.startPrice,
    });

    await this.auctionRepository.create(auction);

    const auctionData = auction.toJSON();

    this.logger.info(`Finished to create auction for auctioneerId (${auctioneerId}), title (${title}) and startPrice (${startPrice})`);

    return {
      id: auctionData.id,
      title: auctionData.title,
      description: auctionData.description,
      photos: auctionData.photos,
      startDate: auctionData.startDate,
      endDate: auctionData.endDate,
      startPrice: auctionData.startPrice,
      status: auctionData.status,
      auctioneerId: auctionData.auctioneerId,
      createdAt: auctionData.createdAt,
      updatedAt: auctionData.updatedAt,
    };
  }
}
