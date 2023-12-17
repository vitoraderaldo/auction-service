import InvalidOrderTypeError from '../../error/invalid-order-type';
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
        throw new InvalidOrderTypeError({ message });
    }
  }

  private createFirstOrder(message: any): Promise<void> {
    const data = message as OrderCreationQueueMessage;
    return this.createFirstOrderUseCase.execute({
      auctionId: data.payload.auctionId,
    });
  }
}
