import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';
import { AuctionRepository } from '../domain/repositories/auction.repository';
import CreateBidUseCase from './create-bid.usecase';
import BidderRepository from '../domain/repositories/bidder.repository';
import BidRepository from '../domain/repositories/bid.repository';
import buildAuction from '../../../../test/util/auction.mock';
import buildBidder from '../../../../test/util/bidder.mock';
import { AuctionStatusEnum } from '../domain/value-objects/auction-status.vo';

describe('Create Bid Use Case', () => {
  let createBidUseCase: CreateBidUseCase;
  let auctionRepository: AuctionRepository;
  let bidderRepository: BidderRepository;
  let bidRepository: BidRepository;

  beforeEach(() => {
    auctionRepository = createMock<AuctionRepository>();
    bidderRepository = createMock<BidderRepository>();
    bidRepository = createMock<BidRepository>();

    createBidUseCase = new CreateBidUseCase(
      auctionRepository,
      bidderRepository,
      bidRepository,
    );
  });

  it('should not create a bid if auction does not exist', async () => {
    jest
      .spyOn(auctionRepository, 'findById')
      .mockResolvedValueOnce(null);

    const input = {
      auctionId: randomUUID(),
      bidderId: randomUUID(),
      value: 50.6,
    };

    const result = createBidUseCase.execute(input);
    await expect(result).rejects.toThrow('Auction not found');
  });

  it('should not create a bid if bidder does not exist', async () => {
    const auction = buildAuction();
    jest
      .spyOn(auctionRepository, 'findById')
      .mockResolvedValueOnce(auction);

    jest
      .spyOn(bidderRepository, 'findById')
      .mockResolvedValueOnce(null);

    const input = {
      auctionId: randomUUID(),
      bidderId: randomUUID(),
      value: 50.6,
    };

    const result = createBidUseCase.execute(input);
    await expect(result).rejects.toThrow('Bidder not found');
  });

  it('should create a bid successfully', async () => {
    const startPrice = 300;
    const bidValue = 500;

    const auction = buildAuction({
      startPrice,
      status: AuctionStatusEnum.PUBLISHED,
    });
    const bidder = buildBidder();

    jest
      .spyOn(auctionRepository, 'findById')
      .mockResolvedValueOnce(auction);

    jest
      .spyOn(bidderRepository, 'findById')
      .mockResolvedValueOnce(bidder);

    const saveSpy = jest.spyOn(bidRepository, 'save');

    const input = {
      auctionId: auction.getId(),
      bidderId: bidder.getId(),
      value: bidValue,
    };

    const result = await createBidUseCase.execute(input);

    expect(result.id).toBeDefined();
    expect(result.value).toEqual(input.value);
    expect(result.auctionId).toEqual(input.auctionId);
    expect(result.bidderId).toEqual(input.bidderId);
    expect(result.createdAt).toBeTruthy();
    expect(result.updatedAt).toBeTruthy();
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
