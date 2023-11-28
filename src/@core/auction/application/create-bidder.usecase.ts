import Bidder from '../domain/entities/bidder.entity';
import BidderRepository from '../domain/repositories/bidder.repository';

interface CreateBidderInput {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateBidderOutput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default class CreateBidderUseCase {
  constructor(
    private readonly bidderRepository: BidderRepository,
  ) {}

  async execute(params: CreateBidderInput): Promise<CreateBidderOutput> {
    const { firstName, lastName, email } = params;

    const foundBidder = await this.bidderRepository.findByEmail(email);

    if (foundBidder) {
      throw new Error('Bidder already exists');
    }

    const bidder = Bidder.create({
      firstName,
      lastName,
      email,
    });

    await this.bidderRepository.create(bidder);
    const bidderData = bidder.toJSON();

    return {
      id: bidderData.id,
      firstName: bidderData.firstName,
      lastName: bidderData.lastName,
      email: bidderData.email,
      createdAt: bidderData.createdAt,
      updatedAt: bidderData.updatedAt,
    };
  }
}
