const appRoot = require('app-root-path');
const winston = require('winston');

// logger configuration
const loggerFormat = winston.format.simple();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        loggerFormat,
        winston.format.timestamp(),
    ),
    transports: [
        new winston.transports.File({
            filename: `${appRoot}/logs/application.log`,
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(loggerFormat, winston.format.timestamp()),
    }));
}

module.exports = logger;
