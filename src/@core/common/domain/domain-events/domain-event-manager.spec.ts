import { faker } from '@faker-js/faker';
import DomainEventManager from './domain-event-manager';
import BidPeriodFinishedEvent from '../../../auction/domain/domain-events/bid-period-finished';
import DomainEventType from './domain-event.type';

describe('Domain Event Manager', () => {
  let eventManager: DomainEventManager;

  beforeEach(() => {
    eventManager = new DomainEventManager(console);
  });

  it('should call a handler for a given event that is published', () => {
    const event = new BidPeriodFinishedEvent({
      auctionId: faker.string.uuid(),
      endDate: new Date().toISOString(),
      winnerBidderId: faker.string.uuid(),
      winningBidId: faker.string.uuid(),
    });

    const eventHandler1 = {
      handle: jest.fn(),
    };
    const eventHandler2 = {
      handle: jest.fn(
        () => Promise.reject(new Error('Random error')),
      ),
    };
    const eventHandler3 = {
      handle: jest.fn(),
    };

    const eventHandler4 = {
      handle: jest.fn(),
    };

    eventManager.subscribe(event.type, eventHandler1);
    eventManager.subscribe(event.type, eventHandler2);
    eventManager.subscribe(event.type, eventHandler3);
    eventManager.subscribe('some-other-event' as DomainEventType, eventHandler4);

    eventManager.publish([event]);

    expect(eventHandler1.handle).toHaveBeenCalledWith(event);
    expect(eventHandler1.handle).toHaveBeenCalledTimes(1);
    expect(eventHandler2.handle).toHaveBeenCalledWith(event);
    expect(eventHandler2.handle).toHaveBeenCalledTimes(1);
    expect(eventHandler3.handle).toHaveBeenCalledWith(event);
    expect(eventHandler3.handle).toHaveBeenCalledTimes(1);
    expect(eventHandler4.handle).not.toHaveBeenCalled();
  });
});
