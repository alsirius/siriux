// Core exports
export * from './types';

// Main logger
export { SiriuxLogger, logger, createLogger, withLogger } from './SiriuxLogger';

// Formatters
export { JsonFormatter } from './formatters/JsonFormatter';
export { SimpleFormatter } from './formatters/SimpleFormatter';

// Version information
export const SIRIUX_LOGGING_VERSION = '1.0.0';
