import NotifyWinningBidderHandler from '../../../notification/application/event-handlers/notify-winning-bidder';
import { LoggerInterface } from '../../application/service/logger';
import DomainEventManager from './domain-event-manager';
import { DomainEventManagerInterface, DomainEventHandler } from './domain-event';
import DomainEventType from './domain-event.type';

export default class DomainEventManagerFactory {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly notifyWinningBidderHandler: NotifyWinningBidderHandler,
  ) {}

  getInstance(): DomainEventManagerInterface {
    const instance = new DomainEventManager(this.logger);
    this.registerHandlers(instance);
    return instance;
  }

  private registerHandlers(manager: DomainEventManagerInterface): void {
    const eventsToHandler = this.getEventsToHandlers();
    eventsToHandler.forEach((handler, event) => {
      manager.subscribe(event, handler);
    });
  }

  private getEventsToHandlers(): Map<DomainEventType, DomainEventHandler> {
    const eventHandlerMap = new Map<DomainEventType, DomainEventHandler>();
    eventHandlerMap.set(DomainEventType.BID_PERIOD_FINISHED, this.notifyWinningBidderHandler);
    return eventHandlerMap;
  }
}
