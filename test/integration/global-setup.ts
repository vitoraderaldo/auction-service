export default async () => {
  process.env.AWS_ACCESS_KEY_ID = 'localstack';
  process.env.AWS_ACCOUNT_ID = '000000000000';
  process.env.AWS_REGION = 'us-east-1';
  process.env.AWS_SECRET_ACCESS_KEY = 'localstack';
  process.env.AWS_SQS_ENDPOINT = 'http://localhost:4566';
  process.env.ENV = 'test';
  process.env.MONGO_DB_NAME = 'test';
  process.env.MONGO_URI = 'mongodb://root:password@localhost:5550';
};
