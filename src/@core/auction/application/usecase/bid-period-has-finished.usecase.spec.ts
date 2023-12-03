import { createMock } from '@golevelup/ts-jest';
import { AuctionRepository } from '../../domain/repositories/auction.repository';
import { EventPublisher } from '../../../common/domain/domain-events/event-publisher';
import BidPeriodHasFinishedUseCase from './bid-period-has-finished.usecase';
import buildAuction from '../../../../../test/util/auction.mock';
import { AuctionStatusEnum } from '../../domain/value-objects/auction-status.vo';
import Auction from '../../domain/entities/auction.entity';

describe('BidPeriodHasFinishedUseCase', () => {
  let auctionRepository: AuctionRepository;
  let eventPublisher: EventPublisher;
  let useCase: BidPeriodHasFinishedUseCase;
  let auction1: Auction;
  let auction2: Auction;
  let auction3: Auction;

  let oneMonthAgo: Date;
  let fiveMinutesAgo: Date;
  let oneMinuteLater: Date;

  beforeEach(async () => {
    eventPublisher = createMock<EventPublisher>();
    auctionRepository = createMock<AuctionRepository>();

    useCase = new BidPeriodHasFinishedUseCase(auctionRepository, eventPublisher, console);

    oneMonthAgo = new Date();
    oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);

    fiveMinutesAgo = new Date();
    fiveMinutesAgo.setUTCMinutes(fiveMinutesAgo.getUTCMinutes() - 5);

    oneMinuteLater = new Date();
    oneMinuteLater.setUTCMinutes(oneMinuteLater.getUTCMinutes() + 1);

    auction1 = buildAuction({
      startDate: oneMonthAgo.toISOString(),
      endDate: fiveMinutesAgo.toISOString(),
      status: AuctionStatusEnum.PUBLISHED,
    });

    auction2 = buildAuction({
      startDate: oneMonthAgo.toISOString(),
      endDate: fiveMinutesAgo.toISOString(),
      status: AuctionStatusEnum.PUBLISHED,
    });

    auction3 = buildAuction({
      startDate: oneMonthAgo.toISOString(),
      endDate: fiveMinutesAgo.toISOString(),
      status: AuctionStatusEnum.PUBLISHED,
    });
  });

  it('should update auctions with expired bid period', async () => {
    const auctionThatMustFail1 = buildAuction({
      startDate: oneMonthAgo.toISOString(),
      endDate: fiveMinutesAgo.toISOString(),
      status: AuctionStatusEnum.CREATED,
    });

    const auctionThatMustFail2 = buildAuction({
      startDate: oneMonthAgo.toISOString(),
      endDate: oneMinuteLater.toISOString(),
      status: AuctionStatusEnum.PUBLISHED,
    });

    const allAuctions = [
      auction1,
      auction2,
      auction3,
      auctionThatMustFail1,
      auctionThatMustFail2,
    ];

    jest
      .spyOn(auctionRepository, 'findExpiredPublishedAuctions')
      .mockResolvedValue(allAuctions);

    const updateSpy = jest.spyOn(auctionRepository, 'update');
    const publishSpy = jest.spyOn(eventPublisher, 'publish');

    const response = await useCase.execute();

    expect(response.total).toBe(5);
    expect(response.success).toBe(3);
    expect(response.failure).toBe(2);
    expect(response.updatedAuctions).toEqual([
      { id: auction1.getId(), status: AuctionStatusEnum.BID_PERIOD_FINISHED },
      { id: auction2.getId(), status: AuctionStatusEnum.BID_PERIOD_FINISHED },
      { id: auction3.getId(), status: AuctionStatusEnum.BID_PERIOD_FINISHED },
    ]);
    expect(auction1.getEvents()).toHaveLength(1);
    expect(auction2.getEvents()).toHaveLength(1);
    expect(auction3.getEvents()).toHaveLength(1);
    expect(auctionThatMustFail1.getEvents()).toHaveLength(0);
    expect(auctionThatMustFail2.getEvents()).toHaveLength(0);
    expect(updateSpy).toHaveBeenCalledTimes(3);
    expect(publishSpy).toHaveBeenCalledTimes(3);
  });
});
