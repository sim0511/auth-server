import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../services/AuthService.js';
import { GoogleAuthService } from '../services/GoogleAuthService.js';
import { ValidationError } from '../errors/applicationError.js';
import { google } from 'googleapis';

const authService = new AuthService();
const googleAuthService = new GoogleAuthService();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
export class AuthController {
  // Endpoint to register a new user account
  // POST /api/v1/register
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


  // Endpoint to log in a user
  public async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    console.log(username, password);

    try {
      if (!username || !password) {
        throw new ValidationError('Username and password are required.');
      }

      const token = await authService.login(username, password);
      // Set token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,      // Prevent JavaScript access
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'strict',  // Protect against CSRF
        maxAge: 5*60*1000, // Token validity: 2 minutes
        path: '/',           // Cookie is valid for all routes 
        domain: 'simrandev.com'
      });

      return res.status(200).json({ message: 'Login successful'});
    } catch (error) {
      next(error); // Pass error to error handler middleware
    }
  }


  // Endpoint to log in a user using Google OAuth
  public async googleSignIn(req: Request, res: Response, next: NextFunction) {
    console.log(" receiving googleSignIn request");
    
    const code = req.query.code as string;
    const  {tokens} = await oauth2Client.getToken(code);
    const idToken = tokens.id_token;
    try {
      if (!idToken) {
        throw new ValidationError('Google ID Token is required.');
      }

      const user = await googleAuthService.verifyGoogleToken(idToken);
      console.log(user);
      // Generate a JWT token for the user
      const token = authService.generateToken(user);
      console.log(token);
      // Set the token in a cookie
      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 5*60*1000, // Token validity: 5 minutes
          path: '/',
          domain: 'simrandev.com'
        });
    res.redirect('https://www.simrandev.com/availability');
    } catch (error) {
      next(error);
    }
  }


  // Endpoint to log out a user
  public async logout(req: Request, res: Response) {
    // Clear the cookie by setting it to an empty value and a past expiration date
    console.log("req.cookies", req.cookies);  
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      domain: 'simrandev.com',
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
  // Endpoint to redirect to Google login page
  public googleLogin(req: Request, res: Response) {
    console.log("googleLogin request received");
    const scopes = ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'];
    
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
    res.redirect(url);
  }
}
