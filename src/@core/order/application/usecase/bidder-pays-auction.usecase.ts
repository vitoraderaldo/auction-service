import { LoggerInterface } from '../../../common/application/service/logger';
import OrderRepository from '../../domain/repositories/order.repository';
import OrderNotFoundError from '../../error/order-not-found';
import { PaymentOptionEnum } from '../../types/payment';

export interface InputDto {
  orderId: string;
  bidderId: string;
  paymentOption: PaymentOptionEnum;
}

export default class BidderPaysAuctionUseCase {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(inputDto: InputDto): Promise<void> {
    const { orderId, bidderId } = inputDto;

    this.logger.info(`Starting payment process for bidderId: (${bidderId}) and orderId: (${orderId})`);

    const order = await this.orderRepository.findById(inputDto.orderId);
    if (!order) {
      throw new OrderNotFoundError({ orderId: inputDto.orderId });
    }

    this.logger.info(`Finished payment process for bidderId: (${bidderId}) and (orderId: ${orderId})`);
  }
}
