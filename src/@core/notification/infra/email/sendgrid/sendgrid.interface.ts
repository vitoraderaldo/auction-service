export default interface SendGridClient {
  sendWithTemplate(data: {
    from: string;
    to: string;
    subject: string;
    templateId: string;
    dynamicTemplateData: any;
  }): Promise<void>;
}
