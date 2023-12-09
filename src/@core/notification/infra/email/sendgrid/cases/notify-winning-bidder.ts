import { SendGridTemplates } from '../../../../../common/domain/environment-config.interface';
import { WinningBidderEmailData } from '../../../../application/service/email/email.types';
import { SendgridEmailSenderClient } from '../sendgrid.interface';

export default class NotifyWinningBidderSendGrid {
  constructor(
    private readonly sendGridClient: SendgridEmailSenderClient,
    private readonly sendgridTemplates: SendGridTemplates,
  ) {}

  send(data: WinningBidderEmailData): Promise<void> {
    const templateId = this.sendgridTemplates.notifyWinningBidder;

    return this.sendGridClient.sendWithTemplate({
      from: data.from,
      to: data.to,
      templateId,
      dynamicTemplateData: data.metadata,
    });
  }
}
