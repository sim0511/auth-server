import { AuthenticationError, ValidationError } from '../errors/applicationError.js';

import { IUser } from '../shared/interfaces/IUser.js';
import User from '../models/User.model.js';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken';

export class AuthService {

  public generateToken(user: IUser): string {
    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the configuration.');
    }

    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
    };

    const options = {
      expiresIn: config.tokenExpiration, // Token expiration, e.g., '1h'
    };

    const token = jwt.sign(payload, config.JWT_SECRET, options);

    return token;
  }

  
  public async register(username: string, email: string, password: string): Promise<IUser> {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new ValidationError(`Username "${username}" is already taken.`);
    }

    const passwordHash = await bcrypt.hash(password, config.saltRounds);
    const user = new User({ username, email, passwordHash });
    return user.save();
  }

  public async login(username: string, password: string): Promise<string> {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      throw new AuthenticationError('Invalid Username or Password.');
    }

    if (!user.passwordHash) {
      throw new AuthenticationError('Invalid Username or Password.');
    }
    
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new AuthenticationError('Invalid Username or Password.');
    }

    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the configuration.');
    }
    
    const token = this.generateToken(user);

    return token;
  }
}
