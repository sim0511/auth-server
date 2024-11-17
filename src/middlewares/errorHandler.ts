import { NextFunction, Request, Response } from 'express';

import { ApplicationError } from '../errors/applicationError.js';
import logger from '../utils/logger.js';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  let statusCode = 500;
  let message = 'Internal Server Error';
  if (err instanceof ApplicationError) {
    // Custom application errors
    statusCode = err.statusCode;
    message = err.message;
    logger.error(`Error: ${message}, Details: ${err.details || 'N/A'}`);
  } else {
    // Unhandled or unknown errors
    logger.error(`Unexpected error: ${err.stack}`);
  }
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace in development
  });
}
export default errorHandler;
