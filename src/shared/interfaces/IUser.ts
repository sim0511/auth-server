import { IAvailability } from './IAvailability.js';
import mongoose from 'mongoose';
export interface IUser {
  _id: mongoose.Types.ObjectId;
  userId: string;
  username: string;
  passwordHash?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  profilePicture?: string;
  lastLoginAt?: Date;
  role: 'employee' | 'manager' | 'admin';
  weeklyAvailability?: IAvailability[];
}
