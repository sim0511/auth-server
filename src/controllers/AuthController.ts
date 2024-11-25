import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../services/AuthService.js';
import { ValidationError } from '../errors/applicationError.js';

const authService = new AuthService();

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    console.warn(req.body);
    const { username, email, password } = req.body;

    try {
      if (!username || !email || !password) {
        throw new ValidationError('Username, email, and password are required.');
      }

      const user = await authService.register(username, email, password);
      return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      next(error); // Pass error to error handler middleware
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    try {
      if (!username || !password) {
        throw new ValidationError('Username and password are required.');
      }

      const token = await authService.login(username, password);
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      next(error); // Pass error to error handler middleware
    }
  }
}
