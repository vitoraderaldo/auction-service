import { createMock } from '@golevelup/ts-jest';
import { AuctionRepository } from '../domain/repositories/auction.repository';
import AuctioneerRepository from '../domain/repositories/auctioneer.repository';
import CreateAuctionUseCase from './create-auction.usecase';
import buildAuctioneer from '../../../../test/unit/util/auctioneer.mock';

describe('CreateAuctionUseCase', () => {
  let auctioneerRepository: AuctioneerRepository;
  let auctionRepository: AuctionRepository;
  let useCase: CreateAuctionUseCase;

  beforeEach(async () => {
    auctioneerRepository = createMock<AuctioneerRepository>();
    auctionRepository = createMock<AuctionRepository>();

    useCase = new CreateAuctionUseCase(auctioneerRepository, auctionRepository);
  });

  it('should not create an auction if the auctioneer does not exist', async () => {
    jest.spyOn(auctioneerRepository, 'findById').mockResolvedValueOnce(null);

    const input = {
      auctioneerId: 'auctioneer-id',
      title: 'New Auction',
      description: 'New auction description',
      startPrice: 50.8,
      startDate: '2021-09-01T00:00:00.000Z',
      endDate: '2021-09-15T00:00:00.000Z',
      photos: [],
    };

    const response = useCase.execute(input);
    expect(response).rejects.toThrow('Auctioneer not found');
  });

  it('should create an auction successfully', async () => {
    const auctioneer = buildAuctioneer();

    const tomorrow = new Date();
    tomorrow.setUTCHours(tomorrow.getUTCHours() + 1);

    const in15Days = new Date();
    in15Days.setUTCDate(in15Days.getUTCDate() + 15);

    jest
      .spyOn(auctioneerRepository, 'findById')
      .mockResolvedValueOnce(auctioneer);

    const saveSpy = jest.spyOn(auctionRepository, 'save');

    const input = {
      auctioneerId: auctioneer.getId(),
      title: 'New Auction',
      description: 'New auction description',
      startPrice: 50.8,
      startDate: tomorrow.toISOString(),
      endDate: in15Days.toISOString(),
      photos: [],
    };

    const response = await useCase.execute(input);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(response.id).toBeDefined();
    expect(response.title).toEqual(input.title);
    expect(response.description).toBe(input.description);
    expect(response.photos).toEqual(input.photos);
    expect(response.startDate).toEqual(input.startDate);
    expect(response.endDate).toEqual(input.endDate);
    expect(response.startPrice).toEqual(input.startPrice);
    expect(response.currentPrice).toEqual(null);
    expect(response.status).toEqual('CREATED');
    expect(response.auctioneerId).toEqual(input.auctioneerId);
    expect(response.createdAt).toBeDefined();
    expect(response.updatedAt).toBeDefined();
  });
});
