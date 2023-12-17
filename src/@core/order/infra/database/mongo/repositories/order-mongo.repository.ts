import Uuid from '../../../../../common/domain/value-objects/uuid.vo';
import Order from '../../../../domain/entities/order.entity';
import OrderRepository from '../../../../domain/repositories/order.repository';
import OrderSchema, { OrderModel } from '../schemas/order.schema';

export default class OrderMongoRepository implements OrderRepository {
  constructor(private readonly model: OrderModel) {}

  async create(order: Order): Promise<void> {
    const document = OrderSchema.toDatabase(order);
    await this.model.create(document);
  }

  async findById(id: Uuid | string): Promise<Order> {
    const value = typeof id === 'string' ? new Uuid(id) : id;
    const document = await this.model.findOne({
      id: value.value.toString(),
    }).exec();
    return document ? OrderSchema.toDomain(document) : null;
  }
}
