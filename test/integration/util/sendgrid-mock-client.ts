import SendGridSdk from '../../../src/@core/notification/infra/email/sendgrid/sendgrid-sdk';

export default class SendgridMockClient extends SendGridSdk {
  private constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
  ) {
    super({
      apiKey,
      baseUrl,
    });
  }

  static create(): SendgridMockClient {
    return new SendgridMockClient(
      process.env.SENDGRID_API_KEY,
      process.env.SENDGRID_BASE_URL,
    );
  }

  async deleteAllEmails(): Promise<void> {
    await fetch(`${this.baseUrl}/api/mails`, {
      method: 'DELETE',
    });
  }

  async getEmailsSentTo(email: string): Promise<{
    datetime: string;
    from: {
      email: string;
    },
    subject: string;
    personalizations: {
      to: {
        email: string;
      }[];
    }[];
    template_id: string;
  }[]> {
    const response = await fetch(`${this.baseUrl}/api/mails?to=${email}`);
    return response.json();
  }
}
