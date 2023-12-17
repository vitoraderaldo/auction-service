import { faker } from '@faker-js/faker';
import Order, { OrderConstructorProps } from './order.entity';
import { PaymentResponsibilityEnum } from '../value-objects/payment-responsibility.vo';
import { PaymentStatusEnum } from '../value-objects/payment-status.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Price from '../../../common/domain/value-objects/price.vo';

describe('Order', () => {
  const validConstructorParams: OrderConstructorProps = {
    id: new Uuid(),
    auctionId: faker.string.uuid(),
    bidderId: faker.string.uuid(),
    auctionFinalValue: new Price(Number(faker.commerce.price())),
    paymentResponsibility: PaymentResponsibilityEnum.SYSTEM,
    paymentStatus: PaymentStatusEnum.PENDING,
    dueDate: faker.date.future().toISOString(),
    paidAt: faker.date.past().toISOString(),
    paidValue: Number(faker.commerce.price()),
    createdAt: '2023-01-01T10:00:00.000Z',
    updatedAt: '2023-01-01T11:00:00.000Z',
  };

  it('should create an instance of Order using the constructor', () => {
    const order = new Order(validConstructorParams);
    const data = order.toJSON();

    expect(order).toBeInstanceOf(Order);
    expect(data.id).toEqual(validConstructorParams.id.value);
    expect(data.auctionId).toEqual(validConstructorParams.auctionId);
    expect(data.auctionFinalValue).toEqual(validConstructorParams.auctionFinalValue.value);
    expect(data.paymentResponsibility).toEqual(validConstructorParams.paymentResponsibility);
    expect(data.paymentStatus).toEqual(validConstructorParams.paymentStatus);
    expect(data.paidAt).toEqual(validConstructorParams.paidAt);
    expect(data.paidValue).toEqual(validConstructorParams.paidValue);
    expect(data.createdAt).toEqual(validConstructorParams.createdAt);
    expect(data.updatedAt).toEqual(validConstructorParams.updatedAt);
  });

  it('should create an instance of Order using the static method create', () => {
    const params = {
      auctionId: faker.string.uuid(),
      bidderId: faker.string.uuid(),
      auctionFinalValue: new Price(Number(faker.commerce.price())),
      paymentResponsibility: PaymentResponsibilityEnum.SYSTEM,
    };
    const order = Order.create(params);
    const data = order.toJSON();

    expect(order).toBeInstanceOf(Order);
    expect(data.id).toBeDefined();
    expect(data.auctionId).toEqual(params.auctionId);
    expect(data.auctionFinalValue).toEqual(params.auctionFinalValue.value);
    expect(data.paymentResponsibility).toEqual(params.paymentResponsibility);
    expect(data.paymentStatus).toEqual(PaymentStatusEnum.PENDING);
    expect(data.paidAt).toBeNull();
    expect(data.paidValue).toBeNull();
    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
  });
});
