import { connect, Mongoose } from 'mongoose';
import { faker } from '@faker-js/faker';
import OrderSchema, {
  OrderModel,
  OrderMongoInterface,
} from '../schemas/order.schema';
import OrderMongoRepository from './order-mongo.repository';
import buildOrder from '../../../../../../../test/util/order.mock';

describe('OrderMongoRepository', () => {
  let connection: Mongoose;
  let model: OrderModel;
  let repository: OrderMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      connection = await connect(process.env.MONGO_URI, { dbName: faker.string.uuid() });
    }

    model = OrderSchema.getModel(connection);
    repository = new OrderMongoRepository(model);
    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('should save a order on the database', async () => {
    const order = buildOrder();
    await repository.create(order);

    const savedOrder = await model.findOne<OrderMongoInterface>({
      id: order.getId(),
    }).exec();

    const orderData = order.toJSON();

    expect(savedOrder.id).toEqual(orderData.id);
    expect(savedOrder.auctionId).toEqual(orderData.auctionId);
    expect(savedOrder.auctionFinalValue).toEqual(orderData.auctionFinalValue);
    expect(savedOrder.paymentResponsibility).toEqual(orderData.paymentResponsibility);
    expect(savedOrder.paymentStatus).toEqual(orderData.paymentStatus);
    expect(savedOrder.paidAt).toEqual(orderData.paidAt);
    expect(savedOrder.paidValue).toEqual(orderData.paidValue);
    expect(savedOrder.createdAt).toBeInstanceOf(Date);
    expect(savedOrder.updatedAt).toBeInstanceOf(Date);
  });

  it('should find a order by id', async () => {
    const orderToBeSaved = buildOrder();
    await repository.create(orderToBeSaved);

    const savedOrder = await model.findOne<OrderMongoInterface>({
      id: orderToBeSaved.getId(),
    }).exec();

    expect(savedOrder.id).toEqual(orderToBeSaved.getId());
    expect(savedOrder.auctionId).toEqual(orderToBeSaved.getAuctionId());
    expect(savedOrder.bidderId).toEqual(orderToBeSaved.getBidderId());
    expect(savedOrder.auctionFinalValue).toEqual(orderToBeSaved.getAuctionFinalValue());
    expect(savedOrder.paymentResponsibility).toEqual(orderToBeSaved.getPaymentResponsibility());
    expect(savedOrder.paymentStatus).toEqual(orderToBeSaved.getPaymentStatus());
    expect(savedOrder.paidAt).toEqual(orderToBeSaved.getPaidAt());
    expect(savedOrder.paidValue).toEqual(orderToBeSaved.getPaidValue());
    expect(savedOrder.createdAt).toBeInstanceOf(Date);
    expect(savedOrder.updatedAt).toBeInstanceOf(Date);
  });
});
