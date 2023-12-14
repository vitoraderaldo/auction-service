import { EventEmitter2 } from 'eventemitter2';
import DomainEventType from './domain-event.type';
import { DomainEventHandler, DomainEvent, DomainEventManagerInterface } from './domain-event';
import { LoggerInterface } from '../../application/service/logger';

export default class DomainEventManager implements DomainEventManagerInterface {
  eventsSubscriber: EventEmitter2;

  constructor(
    private readonly logger: LoggerInterface,
  ) {
    this.eventsSubscriber = new EventEmitter2({
      wildcard: true,
    });
  }

  subscribe(event: DomainEventType, handler: DomainEventHandler): void {
    this.eventsSubscriber.on(event, handler.handle.bind(handler));
  }

  publish(events: DomainEvent[]): void {
    events.forEach((event) => {
      const eventType = event.type;
      this.eventsSubscriber
        .emitAsync(eventType, event)
        .catch((error) => {
          this.logger.error(`Error while handling event: (${eventType}): ${error?.message}`, error);
        });
    });
  }
}
