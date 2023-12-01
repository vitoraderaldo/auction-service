export interface LoggerInterface {
  error(message: string, metadata?: object): void;
  info(message: string, metadata?: object): void;
  warn(message: string, metadata?: object): void;
}
