import { DomainEvent } from '../../../common/domain/domain-events/domain-event';
import DomainEventType from '../../../common/domain/domain-events/domain-event.type';

export interface BidPeriodFinishedEventPayload {
  auctionId: string;
  winnerBidderId: string;
  winningBidId: string;
  endDate: string;
}

export default class BidPeriodFinishedEvent implements DomainEvent<BidPeriodFinishedEventPayload> {
  readonly type = DomainEventType.BID_PERIOD_FINISHED;

  readonly date = new Date().toISOString();

  constructor(
    readonly payload: BidPeriodFinishedEventPayload,
  ) {}
}
