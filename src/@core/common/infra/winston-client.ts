import { createLogger, format, transports } from 'winston';

export default createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: 'auction-service' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf((info) => `${info.timestamp} - [${info.level}]: ${info.message}`),
      ),
    }),
  ],
});
