export interface MongoConfig {
  uri: string;
  dbName: string;
}

export interface EnvironmentConfigInterface {
  getMongo(): MongoConfig;
}
