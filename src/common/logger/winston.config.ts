import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/errors/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
});

const combinedFileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/combined/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

export const winstonConfig = {
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('MyApp', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    errorFileTransport,
    combinedFileTransport,
  ],
};
