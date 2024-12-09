import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { AuthenticationError } from '../errors/applicationError.js';

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if the token is in cookies
    console.log(req.cookies);
    const token = req.cookies?.token;
    if (!token) {
      throw new AuthenticationError('Authentication token is missing.');
    }

    // Verify the token
    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the configuration.');
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Attach the user details to req.user
    (req as any).user = decoded;
    next();
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};
