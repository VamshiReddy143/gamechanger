const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => new Date().toISOString()
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `${timestamp} [${level}] ${stack || message}`;
        })
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    ...(process.env.NODE_ENV === 'production' ? [
      new ElasticsearchTransport({
        level: 'info',
        clientOpts: { 
          node: process.env.ELASTICSEARCH_URL,
          auth: {
            username: process.env.ELASTICSEARCH_USERNAME || '',
            password: process.env.ELASTICSEARCH_PASSWORD || ''
          }
        },
        transformer: (logData) => {
          return {
            '@timestamp': new Date().toISOString(),
            message: logData.message,
            severity: logData.level,
            service: 'team-service',
            ...logData.meta
          };
        }
      })
    ] : [])
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/exceptions.log' 
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/rejections.log' 
    })
  ]
});

// Create a Morgan-compatible stream
logger.morganStream = {
  write: (message) => {
    // Remove any extra new lines
    const cleanMessage = message.replace(/\n$/, '');
    
    // Use http level for Morgan messages
    logger.http(cleanMessage, {
      source: 'morgan',
      // Add additional metadata if needed
      // requestId: req.id (if you're using request IDs)
    });
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

module.exports = logger;