export interface SendgridEmailSenderClient {
  sendWithTemplate(data: {
    from: string;
    to: string;
    templateId: string;
    dynamicTemplateData: any;
  }): Promise<void>;
}

export interface SendgridClient extends SendgridEmailSenderClient {}
