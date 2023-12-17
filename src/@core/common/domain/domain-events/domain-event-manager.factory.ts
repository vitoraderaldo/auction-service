import { LoggerInterface } from '../../application/service/logger';
import DomainEventManager from './domain-event-manager';
import { DomainEventHandler, DomainEventManagerInterface } from './domain-event';
import DomainEventType from './domain-event.type';

export default class DomainEventManagerFactory {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly handlers: {
      event: DomainEventType;
      handlers: DomainEventHandler[];
    }[],
  ) {}

  getInstance(): DomainEventManagerInterface {
    const instance = new DomainEventManager(this.logger);
    this.registerHandlers(instance);
    return instance;
  }

  private registerHandlers(manager: DomainEventManagerInterface): void {
    this.handlers.forEach(({ event, handlers }) => {
      handlers.forEach((handler) => {
        manager.subscribe(event, handler);
      });
    });
  }
}
