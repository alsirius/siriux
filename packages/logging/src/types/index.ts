// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly'
}

// Log entry interface
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  correlationId?: string;
  userId?: string;
  requestId?: string;
  service?: string;
  version?: string;
  environment?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string | number;
  };
  tags?: string[];
  duration?: number;
}

// Logger configuration
export interface LoggerConfig {
  level: LogLevel;
  service: string;
  version?: string;
  environment?: string;
  correlationIdHeader?: string;
  userIdHeader?: string;
  requestIdHeader?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string;
  maxFileSize?: string;
  maxFiles?: string;
  datePattern?: string;
  format?: 'json' | 'simple' | 'combined';
  metadata?: Record<string, any>;
  transports?: TransportConfig[];
}

// Transport configuration
export interface TransportConfig {
  type: 'console' | 'file' | 'http' | 'database' | 'elasticsearch' | 'custom';
  level?: LogLevel;
  format?: 'json' | 'simple' | 'combined';
  options?: Record<string, any>;
}

// Logger interface
export interface Logger {
  error(message: string, meta?: LogMeta): void;
  error(message: string, error: Error, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  http(message: string, meta?: LogMeta): void;
  verbose(message: string, meta?: LogMeta): void;
  debug(message: string, meta?: LogMeta): void;
  silly(message: string, meta?: LogMeta): void;
  child(meta: LogMeta): Logger;
}

// Log metadata
export interface LogMeta {
  correlationId?: string;
  userId?: string;
  requestId?: string;
  duration?: number;
  [key: string]: any;
}

// Transport interface
export interface Transport {
  name: string;
  log(entry: LogEntry): void | Promise<void>;
}

// Formatter interface
export interface Formatter {
  format(entry: LogEntry): string;
}

// Correlation context
export interface CorrelationContext {
  correlationId: string;
  userId?: string;
  requestId?: string;
  startTime: number;
  metadata?: Record<string, any>;
}

// Performance metrics
export interface PerformanceMetrics {
  duration: number;
  memoryUsage?: NodeJS.MemoryUsage;
  cpuUsage?: NodeJS.CpuUsage;
  customMetrics?: Record<string, number>;
}

// Audit log entry
export interface AuditLogEntry extends LogEntry {
  action: string;
  resource: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorCode?: string;
  details?: Record<string, any>;
}

// Health check result
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  checks: Record<string, {
    status: 'pass' | 'fail' | 'warn';
    duration: number;
    message?: string;
    details?: Record<string, any>;
  }>;
  duration: number;
}
