import DomainEventType from './domain-event.type';

export interface DomainEvent<T = any> {
  type: DomainEventType
  date: string
  payload: T
}

export interface DomainEventHandler {
  handle(event: DomainEvent): Promise<void>;
}

export interface EventPublisher {
  publish(events: DomainEvent[]): void
}

export interface EventSubscriber {
  subscribe(event: DomainEventType, handler: DomainEventHandler): void
}

export interface DomainEventManagerInterface extends EventPublisher, EventSubscriber {}
