import AggregateRoot from '../../../common/domain/aggregate-root';
import IsoStringDate from '../../../common/domain/value-objects/iso-string-data.vo';
import Price from '../../../common/domain/value-objects/price.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import PaymentResponsibility, { PaymentResponsibilityEnum } from '../value-objects/payment-responsibility.vo';
import PaymentStatus, { PaymentStatusEnum } from '../value-objects/payment-status.vo';

export type OrderConstructorProps = {
  id: Uuid;
  auctionId: string;
  bidderId: string;
  auctionFinalValue: Price;
  paymentResponsibility: PaymentResponsibilityEnum;
  paymentStatus: PaymentStatusEnum;
  dueDate: string;
  paidAt: string | null;
  paidValue: number | null;
  createdAt: string;
  updatedAt: string;
};

export default class Order extends AggregateRoot {
  private static readonly DEFAULT_DUE_DATE_IN_DAYS = 7;

  private id: Uuid;

  private auctionId: Uuid;

  private bidderId: Uuid;

  private auctionFinalValue: Price;

  private paymentResponsibility: PaymentResponsibility;

  private paymentStatus: PaymentStatus;

  private dueDate: IsoStringDate;

  private paidAt: IsoStringDate | null;

  private paidValue: Price | null;

  private createdAt: IsoStringDate;

  private updatedAt: IsoStringDate;

  constructor(params: OrderConstructorProps) {
    super();
    this.id = params.id;
    this.auctionId = new Uuid(params.auctionId);
    this.bidderId = new Uuid(params.bidderId);
    this.auctionFinalValue = params.auctionFinalValue;
    this.paymentResponsibility = new PaymentResponsibility(params.paymentResponsibility);
    this.paymentStatus = new PaymentStatus(params.paymentStatus);
    this.dueDate = new IsoStringDate(params.dueDate);
    this.paidAt = params.paidAt ? new IsoStringDate(params.paidAt) : null;
    this.paidValue = params.paidValue ? new Price(params.paidValue) : null;
    this.createdAt = new IsoStringDate(params.createdAt);
    this.updatedAt = new IsoStringDate(params.updatedAt);
  }

  static create(params: {
    auctionId: string;
    bidderId: string;
    auctionFinalValue: Price;
    paymentResponsibility: PaymentResponsibilityEnum;
  }) {
    return new Order({
      id: new Uuid(),
      auctionId: params.auctionId,
      bidderId: params.bidderId,
      auctionFinalValue: params.auctionFinalValue,
      paymentResponsibility: params.paymentResponsibility,
      dueDate: this.generateDueDate(),
      paymentStatus: PaymentStatusEnum.PENDING,
      paidAt: null,
      paidValue: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  toJSON() {
    return {
      id: this.id.value,
      auctionId: this.auctionId.value,
      bidderId: this.bidderId.value,
      auctionFinalValue: this.auctionFinalValue.value,
      paymentResponsibility: this.paymentResponsibility.value,
      paymentStatus: this.paymentStatus.value,
      dueDate: this.dueDate.value,
      paidAt: this.paidAt?.value || null,
      paidValue: this.paidValue?.value || null,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  getId(): string {
    return this.id.value;
  }

  // todo test this when it's end of the month
  private static generateDueDate(): string {
    const dueDate = new Date();
    dueDate.setUTCDate(dueDate.getUTCDate() + this.DEFAULT_DUE_DATE_IN_DAYS);

    return dueDate.toISOString();
  }
}
