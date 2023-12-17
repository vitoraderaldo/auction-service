export enum OrderQueueTypeEnum {
  ORDER_CREATION = 'ORDER_CREATION',
}

export interface OrderCreationQueueMessage {
  type: OrderQueueTypeEnum.ORDER_CREATION;
  payload: {
    auctionId: string;
  }
}
