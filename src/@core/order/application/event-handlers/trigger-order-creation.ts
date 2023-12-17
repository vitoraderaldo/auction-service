import BidPeriodFinishedEvent from '../../../auction/domain/domain-events/bid-period-finished';
import { LoggerInterface } from '../../../common/application/service/logger';
import QueueMessagePublisher from '../../../common/application/service/queue-message-publisher';
import { DomainEventHandler } from '../../../common/domain/domain-events/domain-event';
import { OrderCreationQueueMessage, OrderQueueTypeEnum } from '../../types/order.type';

export default class TriggerOrderCreationHandler implements DomainEventHandler {
  constructor(
    private readonly logger: LoggerInterface,
    private orderQueue: QueueMessagePublisher,
  ) {}

  async handle(event: BidPeriodFinishedEvent): Promise<void> {
    const { auctionId } = event.payload;

    this.logger.info(`Starting to publish order creation on queue for auctionId: (${auctionId})`);

    const message: OrderCreationQueueMessage = {
      type: OrderQueueTypeEnum.ORDER_CREATION,
      payload: {
        auctionId,
      },
    };

    await this.orderQueue.publish(message);

    this.logger.info(`Finished publishing order creation on queue for auctionId: (${auctionId})`);
  }
}
