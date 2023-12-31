import { SendGridTemplates } from '../../../../../common/application/service/environment-config.interface';
import { WinningBidderEmailData } from '../../../../application/service/email/email.types';
import { SendgridEmailSenderClient } from '../sendgrid.interface';

export default class NotifyWinningBidderSendGrid {
  constructor(
    private readonly sendGridClient: SendgridEmailSenderClient,
    private readonly sendgridTemplates: SendGridTemplates,
  ) {}

  send(data: WinningBidderEmailData): Promise<void> {
    return this.sendGridClient.sendWithTemplate({
      from: data.from,
      to: data.to,
      templateId: this.sendgridTemplates.notifyWinningBidder,
      dynamicTemplateData: data.metadata,
    });
  }
}
