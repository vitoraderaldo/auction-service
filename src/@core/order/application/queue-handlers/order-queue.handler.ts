import InvalidOrderMessageTypeError from '../../error/invalid-order-type';
import { OrderCreationQueueMessage, OrderQueueTypeEnum } from '../../types/order.type';
import CreateFirstAuctionOrderUseCase from '../usecase/create-first-auction-order.usecase';

export default class OrderQueueHandler {
  constructor(
    private readonly createFirstOrderUseCase: CreateFirstAuctionOrderUseCase,
  ) {}

  async handle(message: {
    type: OrderQueueTypeEnum,
    payload: any,
  }): Promise<void> {
    switch (message?.type) {
      case OrderQueueTypeEnum.ORDER_CREATION:
        await this.createFirstOrder(message);
        break;
      default:
        throw new InvalidOrderMessageTypeError({ message });
    }
  }

  private createFirstOrder(message: OrderCreationQueueMessage): Promise<void> {
    return this.createFirstOrderUseCase.execute({
      auctionId: message.payload.auctionId,
    });
  }
}
