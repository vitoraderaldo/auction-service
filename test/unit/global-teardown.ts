export default async () => {
  await global.mongoServer.stop();
};
