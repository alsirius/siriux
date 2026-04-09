import { Formatter, LogEntry } from '../types';

export class SimpleFormatter implements Formatter {
  format(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const correlationId = entry.correlationId ? `[${entry.correlationId}]` : '';
    const userId = entry.userId ? `[User:${entry.userId}]` : '';
    const requestId = entry.requestId ? `[Req:${entry.requestId}]` : '';
    
    let message = `${timestamp} ${correlationId}${userId}${requestId} [${entry.level.toUpperCase()}] ${entry.message}`;
    
    if (entry.service) {
      message += ` [${entry.service}]`;
    }
    
    if (entry.duration) {
      message += ` (${entry.duration}ms)`;
    }
    
    if (entry.error) {
      message += `\nError: ${entry.error.name} - ${entry.error.message}`;
      if (entry.error.stack) {
        message += `\nStack: ${entry.error.stack}`;
      }
    }
    
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      message += `\nMeta: ${JSON.stringify(entry.metadata)}`;
    }
    
    return message;
  }
}
