import DomainEventType from './domain-event.type';

export interface DomainEvent<T = any> {
  type: DomainEventType
  date: string
  payload: T
}
