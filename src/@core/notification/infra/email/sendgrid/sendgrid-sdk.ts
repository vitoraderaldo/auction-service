import { Client } from '@sendgrid/client';
import { MailService } from '@sendgrid/mail';
import SendGridClient from './sendgrid.interface';

export default class SendGridSdk implements SendGridClient {
  private mailService: MailService;

  constructor(config: {
    apiKey: string;
    baseUrl: string;
  }) {
    const client = new Client();
    client.setApiKey(config.apiKey);
    client.setDefaultRequest({ url: config.baseUrl, baseUrl: config.baseUrl });

    this.mailService = new MailService();
    this.mailService.setApiKey(config.apiKey);
    this.mailService.setClient(client);
  }

  async sendWithTemplate(data: {
    from: string;
    to: string;
    subject: string;
    templateId: string;
    dynamicTemplateData: any;
  }): Promise<void> {
    await this.mailService.send({
      from: data.from,
      to: data.to,
      subject: data.subject,
      content: [{ type: '', value: '' }],
      templateId: data.templateId,
      dynamicTemplateData: data.dynamicTemplateData,
    });
  }
}
