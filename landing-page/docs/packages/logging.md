# @siriux/logging

Structured logging with correlation IDs and multiple transports for Siriux applications.

## Installation

```bash
npm install @siriux/logging
```

## Quick Start

```typescript
import { createLogger } from '@siriux/logging';

// Create logger
const logger = createLogger({
  service: 'my-app',
  level: 'info',
  enableConsole: true
});

// Log messages
logger.info('User logged in', { userId: 'user-123' });
logger.error('Database connection failed', { error: dbError });
```

## Features

- **Structured Logging**: JSON and simple text formats
- **Correlation IDs**: Track requests across services
- **Multiple Transports**: Console, file, HTTP, database
- **Performance Metrics**: Built-in timing and metrics
- **Express Middleware**: Automatic request logging
- **Type Safety**: Full TypeScript support

## Usage

### Basic Logging

```typescript
import { SiriuxLogger } from '@siriux/logging';

const logger = SiriuxLogger.create({
  service: 'my-api',
  version: '1.0.0',
  level: 'info',
  enableConsole: true,
  format: 'json'
});

// Different log levels
logger.error('Database connection failed');
logger.warn('Rate limit approaching');
logger.info('User registered', { userId: 'user-123', email: 'user@example.com' });
logger.debug('Processing request', { requestId: 'req-456' });
```

### Correlation Context

```typescript
// Set correlation context for request tracking
logger.setCorrelationContext({
  correlationId: 'corr-123',
  userId: 'user-456',
  requestId: 'req-789'
});

// All logs will include correlation context
logger.info('Processing payment');
// Output: {
//   "level": "info",
//   "message": "Processing payment",
//   "correlationId": "corr-123",
//   "userId": "user-456",
//   "requestId": "req-789",
//   "timestamp": "2023-12-01T10:30:00.000Z"
// }

// Clear context
logger.clearCorrelationContext();
```

### Performance Logging

```typescript
// Using timer
const endTimer = logger.startTimer('database-query');

// ... perform database operation
await db.query('SELECT * FROM users');

endTimer(); // Automatically logs duration

// Manual performance logging
logger.logPerformance('api-request', {
  duration: 150,
  memoryUsage: process.memoryUsage(),
  customMetrics: {
    databaseQueries: 3,
    cacheHits: 12
  }
});
```

### Express Middleware

```typescript
import express from 'express';
import { createLogger } from '@siriux/logging';

const app = express();
const logger = createLogger({
  service: 'my-api',
  level: 'info',
  enableConsole: true
});

// Add logging middleware
app.use(logger.expressMiddleware());

// Logger is available on request object
app.get('/users', (req, res) => {
  req.logger.info('Fetching users', { count: 10 });
  res.json({ users: [] });
});
```

### Child Loggers

```typescript
// Create child logger with additional context
const userLogger = logger.child({ module: 'user-service' });

userLogger.info('User created', { userId: 'user-123' });
// Output includes module context automatically
```

### Error Logging

```typescript
try {
  await riskyOperation();
} catch (error) {
  // Log error with stack trace
  logger.error('Operation failed', error);
  
  // Or log with additional context
  logger.error('Database query failed', error, {
    query: 'SELECT * FROM users',
    duration: 1500
  });
}
```

## Configuration

### Basic Configuration

```typescript
import { SiriuxLogger } from '@siriux/logging';

const logger = SiriuxLogger.create({
  service: 'my-app',
  version: '1.0.0',
  environment: 'production',
  level: 'info',
  enableConsole: true,
  enableFile: true,
  filePath: './logs/app.log',
  format: 'json',
  metadata: {
    region: 'us-west-2',
    instance: 'i-1234567890'
  }
});
```

### Advanced Configuration

```typescript
const logger = SiriuxLogger.create({
  service: 'my-app',
  level: 'debug',
  correlationIdHeader: 'x-trace-id',
  userIdHeader: 'x-user-id',
  requestIdHeader: 'x-request-id',
  enableConsole: true,
  enableFile: true,
  filePath: './logs',
  maxFileSize: '20m',
  maxFiles: '14d',
  datePattern: 'YYYY-MM-DD',
  format: 'json',
  transports: [
    {
      type: 'console',
      level: 'info',
      format: 'simple'
    },
    {
      type: 'file',
      level: 'debug',
      format: 'json',
      options: {
        filename: './logs/debug.log'
      }
    }
  ]
});
```

## Log Levels

- `error` - Error conditions
- `warn` - Warning conditions  
- `info` - Informational messages
- `http` - HTTP requests/responses
- `verbose` - Verbose information
- `debug` - Debug information
- `silly` - Very detailed debugging

## Log Formats

### JSON Format

```json
{
  "level": "info",
  "message": "User logged in",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "service": "my-app",
  "version": "1.0.0",
  "environment": "production",
  "correlationId": "corr-123",
  "userId": "user-456",
  "requestId": "req-789",
  "duration": 150,
  "metadata": {
    "module": "auth",
    "action": "login"
  }
}
```

### Simple Format

```
2023-12-01T10:30:00.000Z [corr-123] [User:user-456] [Req:req-789] [INFO] User logged in (150ms) [my-app]
```

## Performance Monitoring

### Timer Usage

```typescript
// Automatic timer
const endTimer = logger.startTimer('api-request');

try {
  await processRequest();
  endTimer(); // Logs success with duration
} catch (error) {
  logger.error('Request failed', error);
  endTimer(); // Still logs duration even on error
}
```

### Custom Metrics

```typescript
logger.logPerformance('database-operation', {
  duration: 250,
  memoryUsage: process.memoryUsage(),
  cpuUsage: process.cpuUsage(),
  customMetrics: {
    queryType: 'SELECT',
    table: 'users',
    rowsReturned: 100,
    cacheHit: true
  }
});
```

## Decorator Support

```typescript
import { withLogger } from '@siriux/logging';

class UserService {
  @withLogger()
  async createUser(userData: User) {
    const timer = logger.startTimer('user-creation');
    
    try {
      const user = await this.userRepository.create(userData);
      logger.info('User created successfully', { userId: user.id });
      timer();
      return user;
    } catch (error) {
      logger.error('User creation failed', error);
      timer();
      throw error;
    }
  }
}
```

## Multiple Transports

### Console Transport

```typescript
const logger = createLogger({
  service: 'my-app',
  transports: [
    {
      type: 'console',
      level: 'info',
      format: 'simple'
    }
  ]
});
```

### File Transport

```typescript
const logger = createLogger({
  service: 'my-app',
  enableFile: true,
  filePath: './logs',
  maxFileSize: '20m',
  maxFiles: '14d',
  datePattern: 'YYYY-MM-DD'
});
```

### Custom Transport

```typescript
import { Transport, LogEntry } from '@siriux/logging';

class CustomTransport implements Transport {
  name = 'custom';
  
  async log(entry: LogEntry): Promise<void> {
    // Send to your logging service
    await sendToLoggingService(entry);
  }
}

const logger = createLogger({
  service: 'my-app',
  transports: [new CustomTransport()]
});
```

## Best Practices

### 1. Use Structured Logging

```typescript
// Good
logger.info('User action completed', {
  userId: 'user-123',
  action: 'purchase',
  productId: 'prod-456',
  amount: 99.99,
  currency: 'USD'
});

// Avoid
logger.info('User user-123 completed purchase of prod-456 for 99.99 USD');
```

### 2. Use Correlation IDs

```typescript
// Set at request start
logger.setCorrelationContext({
  correlationId: req.headers['x-trace-id'],
  userId: req.user?.id,
  requestId: generateRequestId()
});

// All logs in request will have correlation context
logger.info('Processing request');
logger.info('Database query completed');
logger.info('Response sent');
```

### 3. Log at Appropriate Levels

```typescript
// Error - System is broken
logger.error('Database connection failed', error);

// Warn - Something unexpected but not broken
logger.warn('Rate limit exceeded', { userId, limit });

// Info - Normal flow information
logger.info('User registered', { userId, email });

// Debug - Detailed debugging info
logger.debug('Cache miss', { key, ttl });
```

### 4. Include Context

```typescript
// Always include relevant context
logger.error('Payment processing failed', error, {
  userId,
  paymentId,
  amount,
  paymentMethod,
  errorCode: error.code
});
```

## Examples

### API Service

```typescript
import express from 'express';
import { createLogger } from '@siriux/logging';

const app = express();
const logger = createLogger({
  service: 'payment-api',
  level: 'info',
  enableConsole: true,
  enableFile: true
});

// Request logging middleware
app.use(logger.expressMiddleware());

// Payment processing
app.post('/payments', async (req, res) => {
  const endTimer = logger.startTimer('payment-processing');
  
  try {
    const payment = await processPayment(req.body);
    
    logger.info('Payment processed successfully', {
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency
    });
    
    res.json({ payment });
  } catch (error) {
    logger.error('Payment processing failed', error, {
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod
    });
    
    res.status(500).json({ error: 'Payment failed' });
  } finally {
    endTimer();
  }
});
```

### Background Worker

```typescript
import { createLogger } from '@siriux/logging';

const logger = createLogger({
  service: 'email-worker',
  level: 'info',
  enableFile: true
});

class EmailWorker {
  async processEmail(job: EmailJob) {
    const jobLogger = logger.child({ 
      jobId: job.id,
      type: job.type 
    });
    
    const endTimer = jobLogger.startTimer('email-processing');
    
    try {
      await this.sendEmail(job);
      jobLogger.info('Email sent successfully', {
        recipient: job.to,
        template: job.template
      });
    } catch (error) {
      jobLogger.error('Email sending failed', error);
      throw error;
    } finally {
      endTimer();
    }
  }
}
```

## Security Considerations

- Never log sensitive data (passwords, tokens, credit cards)
- Use structured logging for easy parsing and analysis
- Implement log rotation to manage disk space
- Use appropriate log levels for production
- Consider log aggregation and monitoring
- Implement audit logging for security events
