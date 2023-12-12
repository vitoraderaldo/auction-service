import NotifyWinningBidderHandler from '../../notification/application/event-handlers/notify-winning-bidder';
import { LoggerInterface } from '../application/service/logger';
import DomainEventManager from './domain-event-manager';
import DomainEventType from './domain-events/domain-event.type';

export default class DomainEventManagerFactory {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly notifyWinningBidderHandler: NotifyWinningBidderHandler,
  ) {}

  getInstance(): DomainEventManager {
    const instance = new DomainEventManager(this.logger);
    this.registerHandlers(instance);
    return instance;
  }

  private registerHandlers(manager: DomainEventManager): void {
    const eventsToHandler = this.getEventsToHandlers();
    eventsToHandler.forEach((handler, event) => {
      manager.register(event, handler);
    });
  }

  private getEventsToHandlers(): Map<DomainEventType, NotifyWinningBidderHandler> {
    const eventHandlerMap = new Map<DomainEventType, NotifyWinningBidderHandler>();
    eventHandlerMap.set(DomainEventType.BID_PERIOD_FINISHED, this.notifyWinningBidderHandler);
    return eventHandlerMap;
  }
}
