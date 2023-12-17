import { createMock } from '@golevelup/ts-jest';
import { AuctionRepository } from '../../../auction/domain/repositories/auction.repository';
import AuctionNotFoundError from '../../../auction/error/auction-not-found';
import NotificationStrategyFactory from '../../../notification/application/service/notification-strategy.factory';
import OrderRepository from '../../domain/repositories/order.repository';
import CreateFirstAuctionOrderUseCase from './create-first-auction-order.usecase';
import buildAuction from '../../../../../test/util/auction.mock';
import buildBid from '../../../../../test/util/bid.mock';

describe('CreateFirstAuctionOrderUseCase', () => {
  let createFirstAuctionOrderUseCase: CreateFirstAuctionOrderUseCase;
  let auctionRepository: AuctionRepository;
  let orderRepository: OrderRepository;
  let notificationFactory: NotificationStrategyFactory;

  beforeEach(() => {
    auctionRepository = createMock<AuctionRepository>();
    orderRepository = createMock<OrderRepository>();
    notificationFactory = createMock<NotificationStrategyFactory>();

    createFirstAuctionOrderUseCase = new CreateFirstAuctionOrderUseCase(
      console,
      auctionRepository,
      orderRepository,
      notificationFactory,
    );
  });

  it('should create an order for a valid auction with bids', async () => {
    const bid = buildBid();
    const auction = buildAuction({
      bids: [bid],
    });

    const auctionId = auction.getId();

    jest
      .spyOn(auctionRepository, 'findById')
      .mockResolvedValue(auction);

    await createFirstAuctionOrderUseCase.execute({ auctionId });

    expect(orderRepository.create).toHaveBeenCalled();
    expect(notificationFactory.getStrategy).toHaveBeenCalledTimes(2);
  });

  it('should skip order creation for an auction with no bids', async () => {
    const auction = buildAuction();
    const auctionId = auction.getId();

    jest
      .spyOn(auctionRepository, 'findById')
      .mockResolvedValue(auction);

    await createFirstAuctionOrderUseCase.execute({ auctionId });

    expect(orderRepository.create).not.toHaveBeenCalled();
    expect(notificationFactory.getStrategy).not.toHaveBeenCalled();
  });

  it('should throw AuctionNotFoundError when auction does not exist', async () => {
    const auctionId = 'some-uuid';

    jest
      .spyOn(auctionRepository, 'findById')
      .mockResolvedValue(null);

    await expect(
      createFirstAuctionOrderUseCase.execute({ auctionId }),
    ).rejects.toThrow(AuctionNotFoundError);

    expect(orderRepository.create).not.toHaveBeenCalled();
    expect(notificationFactory.getStrategy).not.toHaveBeenCalled();
  });
});
