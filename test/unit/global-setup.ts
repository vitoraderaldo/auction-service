import { MongoMemoryServer } from 'mongodb-memory-server';

export default async () => {
  const mongoServer = await MongoMemoryServer.create();

  process.env.MONGO_URI = mongoServer.getUri();
  process.env.MONGO_DB_NAME = 'test';

  global.mongoServer = mongoServer;
};
