import { LoggerInterface } from '../application/service/logger';
import DomainEventManager from './domain-event-manager';

export default class DomainEventManagerFactory {
  constructor(
    private readonly logger: LoggerInterface,
  ) {}

  getInstance(): DomainEventManager {
    const instance = new DomainEventManager(this.logger);
    return instance;
  }
}
