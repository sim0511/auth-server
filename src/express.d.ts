import { User } from './models/User'; // Adjust the import based on your User model location

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}