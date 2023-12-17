import { faker } from '@faker-js/faker';
import Uuid from '../../src/@core/common/domain/value-objects/uuid.vo';
import Price from '../../src/@core/common/domain/value-objects/price.vo';
import Order, { OrderConstructorProps } from '../../src/@core/order/domain/entities/order.entity';
import { PaymentResponsibilityEnum } from '../../src/@core/order/domain/value-objects/payment-responsibility.vo';
import { PaymentStatusEnum } from '../../src/@core/order/domain/value-objects/payment-status.vo';

export default function buildOrder(
  props?: Partial<OrderConstructorProps>,
): Order {
  const price = new Price(faker.number.float());
  const order: OrderConstructorProps = {
    id: new Uuid(faker.string.uuid()),
    auctionId: faker.string.uuid(),
    bidderId: faker.string.uuid(),
    auctionFinalValue: price,
    paymentResponsibility: PaymentResponsibilityEnum.SYSTEM,
    paymentStatus: PaymentStatusEnum.PENDING,
    dueDate: faker.date.future().toISOString(),
    paidAt: null,
    paidValue: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...props,
  };

  return new Order(order);
}
