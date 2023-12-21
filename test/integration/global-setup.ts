export default async () => {
  process.env.AWS_ACCESS_KEY_ID = 'localstack';
  process.env.AWS_ACCOUNT_ID = '000000000000';
  process.env.AWS_REGION = 'us-east-1';
  process.env.AWS_SECRET_ACCESS_KEY = 'localstack';
  process.env.AWS_SQS_ENDPOINT = 'http://localhost:4566';
  process.env.DEFAULT_SENDER_EMAIL = 'local@email.com';
  process.env.ENV = 'test';
  process.env.MONGO_DB_NAME = 'test';
  process.env.MONGO_URI = 'mongodb://root:password@localhost:5550';
  process.env.SENDGRID_API_KEY = 'SG.api-key';
  process.env.SENDGRID_BASE_URL = 'http://localhost:4500';
  process.env.SENDGRID_TEMPLATE_NOTIFY_WINNING_BIDDER = 'sendgrid-template-notify-winning-bidder';
  process.env.SENDGRID_TEMPLATE_PAYMENT_REQUEST_FOR_AUCTION = 'sendgrid-template-payment-request-for-auction';
  process.env.STRIPE_URL = 'http://localhost:12111';
  process.env.STRIPE_SECRET_KEY = 'sk_test_123';
};
