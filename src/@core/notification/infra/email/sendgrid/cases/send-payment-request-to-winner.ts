import { SendGridTemplates } from '../../../../../common/application/service/environment-config.interface';
import { RequestBidderPaymentOnAuctionEmailData } from '../../../../application/service/email/email.types';
import { SendgridEmailSenderClient } from '../sendgrid.interface';

export default class SendPaymentRequestToWinnerSendGrid {
  constructor(
    private readonly sendGridClient: SendgridEmailSenderClient,
    private readonly sendgridTemplates: SendGridTemplates,
  ) {}

  send(data: RequestBidderPaymentOnAuctionEmailData): Promise<void> {
    return this.sendGridClient.sendWithTemplate({
      from: data.from,
      to: data.to,
      templateId: this.sendgridTemplates.paymentRequestForAuction,
      dynamicTemplateData: data.metadata,
    });
  }
}
