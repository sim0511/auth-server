// import User, { IUser } from '../models/User.js';
import User from '../models/User.model.js';
import { IUser } from '../shared/interfaces/IUser.js';

export class UserService {
  // Get user by ID
  public async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId).select('-passwordHash'); // Exclude passwordHash from results
  }

  // Get user by username
  public async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username }).select('-passwordHash'); // Exclude passwordHash from results
  }

  // Get all users (optional)
  public async getAllUsers(): Promise<IUser[]> {
    return await User.find().select('-passwordHash'); // Exclude passwordHash from results
  }
}
