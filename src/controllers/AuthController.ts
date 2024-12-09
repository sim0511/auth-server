import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../services/AuthService.js';
import { GoogleAuthService } from '../services/GoogleAuthService.js';
import { ValidationError } from '../errors/applicationError.js';

const authService = new AuthService();
const googleAuthService = new GoogleAuthService();
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
      next(error);// Pass error to error handler middleware
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    console.log(req.body);
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

  // Endpoint to log in a user using Google OAuth
  public async googleSignIn(req: Request, res: Response, next: NextFunction) {
    const { idToken } = req.body;
    console.log(req.body);
    try {
      if (!idToken) {
        throw new ValidationError('Google ID Token is required.');
      }

      const user = await googleAuthService.verifyGoogleToken(idToken);

      // Generate a JWT token for the user
      const token = authService.generateToken(user);

      // Set the token in a cookie
      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 5*60*1000, // Token validity: 5 minutes
        })
        .json({ message: 'Google sign-in successful', token });
    } catch (error) {
      next(error);
    }
  }


  // Endpoint to log out a user
  public async logout(req: Request, res: Response) {
    // Clear the cookie by setting it to an empty value and a past expiration date
    res.cookie('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Expire the cookie immediately
    });

    return res.status(200).json({ message: 'Logout successful' });
    
  }

  // Endpoint to check auth status of a user
  public async checkAuthStatus(req: Request, res: Response) {

    if (req.user) {
      console.log(req.user);
      res.status(201).json({ authenticated: true, user: req.user, message:"User is Authenticated" });
    } else {
      
      res.status(401).json({ authenticated: false, message:"User is not Authenticated" });
      
    }
  }
}
