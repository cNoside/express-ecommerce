import winston from 'winston';
import type { StreamOptions } from 'morgan';

const loggingLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  access: 4,
  verbose: 5,
  debug: 6,
  silly: 7
};

const { timestamp, prettyPrint, metadata } = winston.format;

export const logger = winston.createLogger({
  level: 'info',
  levels: loggingLevels,
  format: winston.format.combine(
    timestamp({ format: 'DD/MMM/YYYY:hh:mm:ss ZZ' }),
    prettyPrint()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/access.log',
      level: 'access'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

export const morganWinstonStream: StreamOptions = {
  write: (message: string) => {
    logger.log('access', message);
  }
};
