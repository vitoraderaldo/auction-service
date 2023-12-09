import { Client } from '@sendgrid/client';
import { MailService } from '@sendgrid/mail';
import { SendgridClient } from './sendgrid.interface';

export default class SendGridSdk implements SendgridClient {
  private mailService: MailService;

  constructor(private readonly config: {
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
    templateId: string;
    dynamicTemplateData: any;
  }): Promise<void> {
    const body = {
      from: data.from,
      to: data.to,
      templateId: data.templateId,
      dynamicTemplateData: data.dynamicTemplateData,
    };

    if (this.config.baseUrl.endsWith('api.sendgrid.com')) {
      await this.mailService.send(body);
      return;
    }

    await this.mailService.send({
      ...body,
      content: [{ type: 'type', value: 'value' }],
      subject: '',
    });
  }
}
