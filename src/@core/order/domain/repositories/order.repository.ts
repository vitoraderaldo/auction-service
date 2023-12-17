import Uuid from '../../../common/domain/value-objects/uuid.vo';
import Order from '../entities/order.entity';

export default interface OrderRepository {
  create(order: Order): Promise<void>;
  findById(id: Uuid | string): Promise<Order>;
}
