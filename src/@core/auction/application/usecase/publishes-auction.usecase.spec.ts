import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import PublishAuctionUseCase from './publishes-auction.usecase';
import { AuctionRepository } from '../../domain/repositories/auction.repository';
import buildAuction from '../../../../../test/util/auction.mock';
import AuctionNotFoundError from '../../error/auction-not-found';

describe('Publish Auction Use Case', () => {
  let useCase: PublishAuctionUseCase;
  let auctionRepository: AuctionRepository;

  beforeEach(() => {
    auctionRepository = createMock<AuctionRepository>();
    useCase = new PublishAuctionUseCase(auctionRepository, console);
  });

  it('should not publish an auction if it does not exist', async () => {
    jest
      .spyOn(auctionRepository, 'findById')
      .mockResolvedValueOnce(null);

    const input = {
      auctionId: faker.string.uuid(),
      auctioneerId: faker.string.uuid(),
    };

    try {
      await useCase.execute(input);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toBeInstanceOf(AuctionNotFoundError);
      expect(err.details).toEqual({
        auctionId: input.auctionId,
      });
    }
  });

  it('should publish an auction', async () => {
    const auction = buildAuction();
    jest
      .spyOn(auctionRepository, 'findById')
      .mockResolvedValueOnce(auction);

    const updateSpy = jest.spyOn(auctionRepository, 'update');

    const input = {
      auctionId: faker.string.uuid(),
      auctioneerId: faker.string.uuid(),
    };

    await useCase.execute(input);

    expect(updateSpy).toHaveBeenCalledTimes(1);
  });
});
