import { NotificationType } from '../notification-type';

interface EmailData<T> {
  type: NotificationType;
  from: string;
  subject?: string;
  to: string;
  metadata: T;
}

export interface WinningBidderEmailData extends EmailData<{
  bidder: {
    firstName: string;
    lastName: string;
  };
  bid: {
    value: number;
    date: string;
  },
  auction: {
    title: string;
    description: string;
  }
}> {}

export interface RequestBidderPaymentOnAuctionEmailData extends EmailData<{
  bidder: {
    firstName: string;
    lastName: string;
  };
  auction: {
    title: string;
    description: string;
  },
  order: {
    bidValue: number;
    total: number;
    dueDate: string;
  },
}> {}

export type AllKindOfEmailData = WinningBidderEmailData | RequestBidderPaymentOnAuctionEmailData;

export default interface EmailSender {
  send(data: AllKindOfEmailData): Promise<void>;
}
