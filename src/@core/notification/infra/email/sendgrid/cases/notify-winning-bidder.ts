import { SendGridTemplates } from '../../../../../common/domain/environment-config.interface';
import { WinningBidderEmailData } from '../../../../application/service/email/email.types';
import SendGridClient from '../sendgrid.interface';

export default class NotifyWinningBidderSendGrid {
  constructor(
    private readonly sendGridClient: SendGridClient,
    private readonly sendgridTemplates: SendGridTemplates,
  ) {}

  send(data: WinningBidderEmailData): Promise<void> {
    const templateId = this.sendgridTemplates.notifyWinningBidder;

    return this.sendGridClient.sendWithTemplate({
      from: data.from,
      to: data.to,
      subject: data.subject,
      templateId,
      dynamicTemplateData: {
        firstName: data.data.bidder.firstName,
        lastName: data.data.bidder.lastName,
        bidValue: data.data.bid.value,
        bidDate: data.data.bid.date,
        auctionTitle: data.data.auction.title,
        auctionDescription: data.data.auction.description,
      },
    });
  }
}
