import { DomainEvent } from '../../domain/domain-events/domain-event';

export default interface DomainEventHandler {
  handle(event: DomainEvent): Promise<void>;
}
