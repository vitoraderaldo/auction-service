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

export type AllKindOfEmailData = WinningBidderEmailData | EmailData<string>;

export default interface EmailSender {
  send(data: AllKindOfEmailData): Promise<void>;
}
