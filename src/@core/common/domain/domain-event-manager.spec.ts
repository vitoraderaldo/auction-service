import { randomUUID } from 'crypto';
import DomainEventManager from './domain-event-manager';
import BidPeriodFinishedEvent from './domain-events/bid-period-finished';
import DomainEventType from './domain-events/domain-event.type';

describe('Domain Event Manager', () => {
  let eventManager: DomainEventManager;

  beforeEach(() => {
    eventManager = new DomainEventManager(console);
  });

  it('should call a handler for a given event that is published', () => {
    const event = new BidPeriodFinishedEvent({
      auctionId: randomUUID(),
      endDate: new Date().toISOString(),
    });

    const eventHandler1 = jest.fn(
      () => Promise.resolve(),
    );
    const eventHandler2 = jest.fn(
      () => Promise.reject(new Error('Random error')),
    );
    const eventHandler3 = jest.fn();

    const eventHandler4 = jest.fn();

    eventManager.register(event.type, eventHandler1);
    eventManager.register(event.type, eventHandler2);
    eventManager.register(event.type, eventHandler3);
    eventManager.register('some-other-event' as DomainEventType, eventHandler4);

    eventManager.publish([event]);

    expect(eventHandler1).toHaveBeenCalledWith(event);
    expect(eventHandler1).toHaveBeenCalledTimes(1);
    expect(eventHandler2).toHaveBeenCalledWith(event);
    expect(eventHandler2).toHaveBeenCalledTimes(1);
    expect(eventHandler3).toHaveBeenCalledWith(event);
    expect(eventHandler3).toHaveBeenCalledTimes(1);
    expect(eventHandler4).not.toHaveBeenCalled();
  });
});
