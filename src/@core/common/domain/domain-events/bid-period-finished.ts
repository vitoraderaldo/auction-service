import { DomainEvent } from './domain-event';
import DomainEventType from './domain-event.type';

interface BidPeriodFinishedEventPayload {
  auctionId: string;
  endDate: string;
}

export default class BidPeriodFinishedEvent implements DomainEvent<BidPeriodFinishedEventPayload> {
  readonly type = DomainEventType.BID_PERIOD_FINISHED;

  readonly date = new Date().toISOString();

  constructor(
    readonly payload: BidPeriodFinishedEventPayload,
  ) {}
}
