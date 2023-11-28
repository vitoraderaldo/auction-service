import Auctioneer from '../domain/entities/auctioneer.entity';
import AuctioneerRepository from '../domain/repositories/auctioneer.repository';

interface CreateAuctioneerInput {
  firstName: string
  lastName: string
  email: string;
  registration: string;
}

export interface CreateAuctioneerOutput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registration: string;
  createdAt: string;
  updatedAt: string;
}

export default class CreateAuctioneerUseCase {
  constructor(
    private readonly auctioneerRepository: AuctioneerRepository,
  ) {}

  async execute(input: CreateAuctioneerInput): Promise<CreateAuctioneerOutput> {
    const { registration, email } = input;

    const foundAuctioneer = await this.auctioneerRepository.findByRegistrationOrEmail({
      registration,
      email,
    });

    if (foundAuctioneer) {
      throw new Error(`Auctioneer already exists with email '${email}' or registration '${registration}'`);
    }

    const auctioneer = Auctioneer.create({
      name: {
        firstName: input.firstName,
        lastName: input.lastName,
      },
      email,
      registration,
    });

    await this.auctioneerRepository.create(auctioneer);

    const auctioneerData = auctioneer.toJSON();

    return {
      id: auctioneerData.id,
      firstName: auctioneerData.firstName,
      lastName: auctioneerData.lastName,
      email: auctioneerData.email,
      registration: auctioneerData.registration,
      createdAt: auctioneerData.createdAt,
      updatedAt: auctioneerData.updatedAt,
    };
  }
}
