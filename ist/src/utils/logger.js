import 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';
const logFormat = format.printf(({ timestamp, level, message, stack })=>{
    return `${timestamp} [${level}]: ${stack || message}`;
});
const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), format.errors({
        stack: true
    }), format.json()),
    defaultMeta: {
        service: 'authorization-service'
    },
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), logFormat // Use readable format for console
            )
        }),
        new transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d' // Keep logs for the last 14 days
        }),
        new transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        })
    ],
    exceptionHandlers: [
        new transports.File({
            filename: 'logs/exceptions.log'
        })
    ],
    rejectionHandlers: [
        new transports.File({
            filename: 'logs/rejections.log'
        })
    ]
});
export default logger;
