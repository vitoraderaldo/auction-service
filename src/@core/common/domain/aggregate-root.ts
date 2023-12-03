import { DomainEvent } from './domain-events/domain-event';
import Entity from './entity';

export default abstract class AggregateRoot extends Entity {
  protected events: Set<DomainEvent> = new Set<DomainEvent>();

  addEvent(event: DomainEvent) {
    this.events.add(event);
  }

  getEvents(): DomainEvent[] {
    return Array.from(this.events);
  }
}
