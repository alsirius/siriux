// Mock logging system with multiple output options
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export enum LogOutput {
  CONSOLE = 'console',
  FILE = 'file',
  DATABASE = 'database',
  CLOUD = 'cloud'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  requestId?: string;
  service: string;
  environment: string;
}

export interface MockLoggerConfig {
  level: LogLevel;
  outputs: LogOutput[];
  service: string;
  environment: string;
  enableStructuredLogging: boolean;
  enableMetrics: boolean;
}

export class MockLogger {
  private config: MockLoggerConfig;
  private logs: LogEntry[] = [];
  private metrics: Map<string, number> = new Map();

  constructor(config: Partial<MockLoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      outputs: [LogOutput.CONSOLE],
      service: 'siriux-app',
      environment: process.env.NODE_ENV || 'development',
      enableStructuredLogging: true,
      enableMetrics: true,
      ...config
    };
  }

  private createLogEntry(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      service: this.config.service,
      environment: this.config.environment
    };
  }

  private async writeLog(entry: LogEntry): Promise<void> {
    // Store in memory
    this.logs.push(entry);
    
    // Keep only last 1000 logs to prevent memory issues
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // Update metrics
    const metricKey = `logs_${entry.level}`;
    this.metrics.set(metricKey, (this.metrics.get(metricKey) || 0) + 1);

    // Write to configured outputs
    for (const output of this.config.outputs) {
      await this.writeToOutput(entry, output);
    }
  }

  private async writeToOutput(entry: LogEntry, output: LogOutput): Promise<void> {
    switch (output) {
      case LogOutput.CONSOLE:
        this.writeToConsole(entry);
        break;
      case LogOutput.FILE:
        this.writeToFile(entry);
        break;
      case LogOutput.DATABASE:
        this.writeToDatabase(entry);
        break;
      case LogOutput.CLOUD:
        this.writeToCloud(entry);
        break;
    }
  }

  private writeToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.service}]`;
    
    if (this.config.enableStructuredLogging) {
      console.log(prefix, entry.message, entry.metadata || {});
    } else {
      console.log(`${prefix} ${entry.message}`);
    }
  }

  private writeToFile(entry: LogEntry): void {
    // Mock file writing
    console.log(`📁 Writing to log file: ${entry.id} - ${entry.message}`);
  }

  private writeToDatabase(entry: LogEntry): void {
    // Mock database writing
    console.log(`🗄️  Writing to database: ${entry.id} - ${entry.message}`);
  }

  private writeToCloud(entry: LogEntry): void {
    // Mock cloud logging (e.g., CloudWatch, Datadog)
    console.log(`☁️  Writing to cloud: ${entry.id} - ${entry.message}`);
  }

  // Public logging methods
  async debug(message: string, metadata?: Record<string, any>): Promise<void> {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, metadata);
    await this.writeLog(entry);
  }

  async info(message: string, metadata?: Record<string, any>): Promise<void> {
    const entry = this.createLogEntry(LogLevel.INFO, message, metadata);
    await this.writeLog(entry);
  }

  async warn(message: string, metadata?: Record<string, any>): Promise<void> {
    const entry = this.createLogEntry(LogLevel.WARN, message, metadata);
    await this.writeLog(entry);
  }

  async error(message: string, metadata?: Record<string, any>): Promise<void> {
    const entry = this.createLogEntry(LogLevel.ERROR, message, metadata);
    await this.writeLog(entry);
  }

  // Structured logging methods
  async logUserAction(userId: string, action: string, metadata?: Record<string, any>): Promise<void> {
    await this.info(`User action: ${action}`, {
      userId,
      action,
      category: 'user_action',
      ...metadata
    });
  }

  async logApiRequest(method: string, path: string, statusCode: number, duration: number, metadata?: Record<string, any>): Promise<void> {
    await this.info(`API Request: ${method} ${path}`, {
      method,
      path,
      statusCode,
      duration,
      category: 'api_request',
      ...metadata
    });
  }

  async logError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.error(error.message, {
      stack: error.stack,
      name: error.name,
      category: 'error',
      ...context
    });
  }

  async logPerformance(operation: string, duration: number, metadata?: Record<string, any>): Promise<void> {
    await this.info(`Performance: ${operation}`, {
      operation,
      duration,
      category: 'performance',
      ...metadata
    });
  }

  // Query methods
  async getLogs(level?: LogLevel, limit: number = 100): Promise<LogEntry[]> {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    return filteredLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async getLogsByUser(userId: string, limit: number = 50): Promise<LogEntry[]> {
    return this.logs
      .filter(log => log.metadata?.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async searchLogs(query: string, limit: number = 100): Promise<LogEntry[]> {
    const lowerQuery = query.toLowerCase();
    return this.logs
      .filter(log => 
        log.message.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(log.metadata || {}).toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Metrics methods
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  async getLogStats(): Promise<{
    total: number;
    byLevel: Record<LogLevel, number>;
    byHour: Record<string, number>;
    topErrors: string[];
  }> {
    const byLevel: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0
    };

    const byHour: Record<string, number> = {};
    const errorMessages: string[] = [];

    for (const log of this.logs) {
      byLevel[log.level]++;
      
      const hour = new Date(log.timestamp).getHours().toString();
      byHour[hour] = (byHour[hour] || 0) + 1;
      
      if (log.level === LogLevel.ERROR) {
        errorMessages.push(log.message);
      }
    }

    return {
      total: this.logs.length,
      byLevel,
      byHour,
      topErrors: errorMessages.slice(0, 10)
    };
  }

  // Utility methods
  clearLogs(): void {
    this.logs = [];
    this.metrics.clear();
  }

  async flush(): Promise<void> {
    // Mock flush operation
    console.log('🔄 Flushing logs...');
    
    for (const output of this.config.outputs) {
      console.log(`✅ Flushed to ${output}`);
    }
  }

  // Configuration methods
  updateConfig(newConfig: Partial<MockLoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): MockLoggerConfig {
    return { ...this.config };
  }
}

// Factory function
export const createMockLogger = (config?: Partial<MockLoggerConfig>): MockLogger => {
  return new MockLogger(config);
};

// Environment-based logger
export const createEnvironmentLogger = (): MockLogger => {
  const config: Partial<MockLoggerConfig> = {
    level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    outputs: process.env.LOG_OUTPUTS?.split(',') as LogOutput[] || [LogOutput.CONSOLE],
    service: process.env.SERVICE_NAME || 'siriux-app',
    environment: process.env.NODE_ENV || 'development'
  };

  return new MockLogger(config);
};
