import { DomainEvent } from './domain-event';

export interface EventPublisher {
  publish(events: DomainEvent[]): void
}
