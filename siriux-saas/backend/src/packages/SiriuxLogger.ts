import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { 
  LogLevel, 
  LogEntry, 
  LoggerConfig, 
  Logger, 
  LogMeta, 
  CorrelationContext,
  PerformanceMetrics,
  LogFormat,
  LogOutput
} from './types';
import { JsonFormatter } from './formatters/JsonFormatter';
import { SimpleFormatter } from './formatters/SimpleFormatter';

export class SiriuxLogger implements Logger {
  private winston: winston.Logger;
  private config: LoggerConfig;
  private correlationContext?: CorrelationContext;

  constructor(config: LoggerConfig) {
    this.config = config;
    this.winston = this.createWinstonLogger(config);
  }

  // Static factory method
  static create(config: Partial<LoggerConfig> = {}): SiriuxLogger {
    const defaultConfig: LoggerConfig = {
      level: LogLevel.INFO,
      service: 'siriux-app',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      correlationIdHeader: 'x-correlation-id',
      userIdHeader: 'x-user-id',
      requestIdHeader: 'x-request-id',
      enableConsole: true,
      enableFile: false,
      format: LogFormat.JSON,
      outputs: [LogOutput.CONSOLE],
      metadata: {}
    };

    return new SiriuxLogger({ ...defaultConfig, ...config });
  }

  // Logging methods
  error(message: string, meta?: LogMeta | Error): void {
    if (meta instanceof Error) {
      this.log(LogLevel.ERROR, message, { error: this.serializeError(meta) });
    } else {
      this.log(LogLevel.ERROR, message, meta);
    }
  }

  warn(message: string, meta?: LogMeta): void {
    this.log(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: LogMeta): void {
    this.log(LogLevel.INFO, message, meta);
  }

  http(message: string, meta?: LogMeta): void {
    this.log(LogLevel.HTTP, message, meta);
  }

  verbose(message: string, meta?: LogMeta): void {
    this.log(LogLevel.VERBOSE, message, meta);
  }

  debug(message: string, meta?: LogMeta): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  silly(message: string, meta?: LogMeta): void {
    this.log(LogLevel.SILLY, message, meta);
  }

  // Create child logger with additional metadata
  child(meta: LogMeta): Logger {
    const childConfig = { ...this.config };
    childConfig.metadata = { ...this.config.metadata, ...meta };
    
    const childLogger = new SiriuxLogger(childConfig);
    childLogger.correlationContext = this.correlationContext;
    
    return childLogger;
  }

  // Correlation context management
  setCorrelationContext(context: Partial<CorrelationContext>): void {
    this.correlationContext = {
      correlationId: context.correlationId || uuidv4(),
      startTime: context.startTime || Date.now(),
      userId: context.userId,
      requestId: context.requestId,
      metadata: context.metadata
    };
  }

  getCorrelationContext(): CorrelationContext | undefined {
    return this.correlationContext;
  }

  clearCorrelationContext(): void {
    this.correlationContext = undefined;
  }

  // Performance logging
  logPerformance(operation: string, metrics: PerformanceMetrics): void {
    this.info(`Performance: ${operation}`, {
      duration: metrics.duration,
      memoryUsage: metrics.memoryUsage,
      cpuUsage: metrics.cpuUsage,
      customMetrics: metrics.customMetrics,
      type: 'performance'
    });
  }

  // Timer functionality
  startTimer(operation: string): () => void {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      this.info(`Timer: ${operation}`, {
        duration,
        operation,
        type: 'timer'
      });
    };
  }

  // Express middleware
  expressMiddleware() {
    return (req: any, res: any, next: any) => {
      const correlationId = req.headers[this.config.correlationIdHeader!] || 
                          req.headers['x-correlation-id'] || 
                          uuidv4();
      
      const userId = req.headers[this.config.userIdHeader!] || 
                    req.headers['x-user-id'] || 
                    req.user?.id;

      const requestId = req.headers[this.config.requestIdHeader!] || 
                       req.headers['x-request-id'] || 
                       uuidv4();

      this.setCorrelationContext({
        correlationId,
        userId,
        requestId
      });

      // Add correlation info to request
      req.correlationId = correlationId;
      req.logger = this;

      const startTime = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        this.http(`${req.method} ${req.path}`, {
          statusCode: res.statusCode,
          duration,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress,
          method: req.method,
          path: req.path,
          type: 'http'
        });
      });

      next();
    };
  }

  // Private methods
  private log(level: LogLevel, message: string, meta?: LogMeta): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.config.service,
      version: this.config.version,
      environment: this.config.environment,
      metadata: { ...this.config.metadata, ...meta }
    };

    // Add correlation context if available
    if (this.correlationContext) {
      logEntry.correlationId = this.correlationContext.correlationId;
      logEntry.userId = this.correlationContext.userId;
      logEntry.requestId = this.correlationContext.requestId;
      
      // Calculate duration if we have start time
      if (this.correlationContext.startTime) {
        logEntry.duration = Date.now() - this.correlationContext.startTime;
      }
    }

    // Add any metadata from correlation context
    if (this.correlationContext?.metadata) {
      logEntry.metadata = { ...logEntry.metadata, ...this.correlationContext.metadata };
    }

    this.winston.log(level, message, logEntry);
  }

  private createWinstonLogger(config: LoggerConfig): winston.Logger {
    const transports: winston.transport[] = [];

    // Console transport
    if (config.enableConsole !== false) {
      transports.push(new winston.transports.Console({
        format: config.format === 'json' ? 
          winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ) :
          winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
          )
      }));
    }

    // File transport
    if (config.enableFile) {
      transports.push(new winston.transports.File({
        filename: config.filePath || 'app.log',
        maxsize: Number(config.maxFileSize) || 5242880,
        maxFiles: Number(config.maxFiles) || 5
      }));
    }

    // Custom transports
    if (config.transports) {
      config.transports.forEach(transportConfig => {
        // Add custom transports based on configuration
        // This would be extended based on specific transport needs
      });
    }

    return winston.createLogger({
      level: config.level,
      transports,
      exitOnError: false
    });
  }

  private serializeError(error: Error): LogEntry['error'] {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: (error as any).code
    };
  }
}

// Default logger instance
export const logger = SiriuxLogger.create();

// Utility functions
export function createLogger(config?: Partial<LoggerConfig>): SiriuxLogger {
  return SiriuxLogger.create(config);
}

// Export Logger interface for re-export
export type { Logger } from './types';

export function withLogger(logger: SiriuxLogger) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const timer = logger.startTimer(`${target.constructor.name}.${propertyKey}`);
      
      try {
        const result = await originalMethod.apply(this, args);
        timer();
        return result;
      } catch (error) {
        logger.error(`Error in ${target.constructor.name}.${propertyKey}`, error as Error);
        throw error;
      }
    };

    return descriptor;
  };
}
