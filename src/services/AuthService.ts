import { AuthenticationError, ValidationError } from '../errors/applicationError.js';
import User, { IUser } from '../models/User.js';

import bcrypt from 'bcrypt';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken';

export class AuthService {
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
    if (!user) {
      throw new AuthenticationError('Invalid username or password.');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new AuthenticationError('Invalid username or password.');
    }

    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the configuration.');
    }
    
    const token = jwt.sign({ userId: user._id, username: user.username }, config.JWT_SECRET, {
      expiresIn: config.tokenExpiration,
    });

    return token;
  }
}
