import winston from 'winston';

export interface LogContext {
  [key: string]: any;
}

class Logger {
  private winston: winston.Logger;

  constructor() {
    this.winston = winston.createLogger({
      level: process.env['LOG_LEVEL'] || 'info',
      format: this.getLogFormat(),
      transports: [
        new winston.transports.Console({
          format: this.getLogFormat()
        })
      ]
    });
  }

  private getLogFormat(): winston.Logform.Format {
    const isJson = process.env['LOG_FORMAT'] === 'json';
    
    if (isJson) {
      return winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      );
    }

    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
      })
    );
  }

  public info(message: string, context?: LogContext): void {
    this.winston.info(message, context);
  }

  public error(message: string, context?: LogContext): void {
    this.winston.error(message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.winston.warn(message, context);
  }

  public debug(message: string, context?: LogContext): void {
    this.winston.debug(message, context);
  }

  public http(message: string, context?: LogContext): void {
    this.winston.http(message, context);
  }
}

export const logger = new Logger();
