import { Schema, Model, Mongoose } from 'mongoose';
import { PaymentResponsibilityEnum } from '../../../../domain/value-objects/payment-responsibility.vo';
import { PaymentStatusEnum } from '../../../../domain/value-objects/payment-status.vo';
import Order from '../../../../domain/entities/order.entity';
import Uuid from '../../../../../common/domain/value-objects/uuid.vo';
import Price from '../../../../../common/domain/value-objects/price.vo';

export interface OrderMongoInterface {
  id: string;
  auctionId: string;
  bidderId: string;
  auctionFinalValue: number;
  paymentResponsibility: PaymentResponsibilityEnum;
  paymentStatus: PaymentStatusEnum;
  dueDate: string;
  paidAt: string | null;
  paidValue: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    auctionId: {
      type: String,
      required: true,
    },
    bidderId: {
      type: String,
      required: true,
    },
    auctionFinalValue: {
      type: Number,
      required: true,
    },
    paymentResponsibility: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    paidAt: {
      type: String,
      required: false,
    },
    paidValue: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

interface OrderMongoDocument extends OrderMongoInterface, Document {}
export type OrderModel = Model<OrderMongoDocument>;

export default class OrderSchema {
  static getModel(connection: Mongoose): OrderModel {
    return connection.model<OrderMongoDocument>('Order', orderSchema);
  }

  static toDomain(document: OrderMongoInterface) {
    if (!document) return null;

    return new Order({
      id: new Uuid(document.id),
      auctionId: document.auctionId,
      bidderId: document.bidderId,
      auctionFinalValue: new Price(document.auctionFinalValue),
      paymentResponsibility: document.paymentResponsibility,
      paymentStatus: document.paymentStatus,
      dueDate: document.dueDate,
      paidAt: document.paidAt,
      paidValue: document.paidValue,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }

  static toDatabase(domain: Order) {
    if (!domain) return null;

    const data = domain.toJSON();

    const mongoData: Omit<OrderMongoInterface, 'createdAt' | 'updatedAt'> = {
      id: data.id,
      auctionId: data.auctionId,
      bidderId: data.bidderId,
      auctionFinalValue: data.auctionFinalValue,
      paymentResponsibility: data.paymentResponsibility,
      paymentStatus: data.paymentStatus,
      dueDate: data.dueDate,
      paidAt: data.paidAt,
      paidValue: data.paidValue,
    };

    return mongoData;
  }
}
