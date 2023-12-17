import { createMock } from '@golevelup/ts-jest';
import CreateFirstAuctionOrderUseCase from '../usecase/create-first-auction-order.usecase';
import InvalidOrderTypeError from '../../error/invalid-order-type';
import { OrderQueueTypeEnum, OrderCreationQueueMessage } from '../../types/order.type';
import OrderQueueHandler from './order-queue.handler';

describe('OrderQueueHandler', () => {
  let createFirstOrderUseCase: CreateFirstAuctionOrderUseCase;
  let orderQueueHandler: OrderQueueHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    createFirstOrderUseCase = createMock<CreateFirstAuctionOrderUseCase>();
    orderQueueHandler = new OrderQueueHandler(createFirstOrderUseCase);
  });

  it('should use createFirstOrderUseCase when type is ORDER_CREATION', async () => {
    const mockMessage: OrderCreationQueueMessage = {
      type: OrderQueueTypeEnum.ORDER_CREATION,
      payload: {
        auctionId: 'exampleAuctionId',
      },
    };

    await orderQueueHandler.handle(mockMessage);

    expect(createFirstOrderUseCase.execute).toHaveBeenCalledWith({
      auctionId: mockMessage.payload.auctionId,
    });
  });

  it('should throw InvalidOrderTypeError for an unknown type', async () => {
    const mockMessage: any = {
      type: 'UNKNOWN_TYPE',
      payload: {},
    };

    await expect(orderQueueHandler.handle(mockMessage))
      .rejects.toThrow(InvalidOrderTypeError);
  });
});
