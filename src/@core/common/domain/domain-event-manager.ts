import { EventEmitter2 } from 'eventemitter2';
import { EventPublisher } from './domain-events/event-publisher';
import DomainEventType from './domain-events/domain-event.type';
import { DomainEvent } from './domain-events/domain-event';
import { LoggerInterface } from '../application/service/logger';

export default class DomainEventManager implements EventPublisher {
  eventsSubscriber: EventEmitter2;

  constructor(
    private readonly logger: LoggerInterface,
  ) {
    this.eventsSubscriber = new EventEmitter2({
      wildcard: true,
    });
  }

  register(event: DomainEventType, handler: (event: DomainEvent) => Promise<void>): void {
    this.eventsSubscriber.on(event, handler);
  }

  publish(events: DomainEvent[]): void {
    events.forEach((event) => {
      const eventType = event.type;
      this.eventsSubscriber
        .emitAsync(eventType, event)
        .catch((error) => {
          this.logger.error(`Error while handling event ${eventType}: ${error?.message}`, error);
        });
    });
  }
}
