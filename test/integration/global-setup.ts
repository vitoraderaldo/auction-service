export default async () => {
  process.env.MONGO_URI = 'mongodb://root:password@localhost:5550';
  process.env.MONGO_DB_NAME = 'test';
};
