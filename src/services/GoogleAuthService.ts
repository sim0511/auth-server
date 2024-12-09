import { AuthenticationError } from '../errors/applicationError.js';
import { IUser } from '../shared/interfaces/IUser.js';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.model.js';
import { config } from '../config/config.js';

export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    if (!config.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID is not defined in the configuration.');
    }

    this.client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
  }

  // Verify Google ID Token
  public async verifyGoogleToken(idToken: string): Promise<IUser> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AuthenticationError('Invalid Google token.');
    }
    console.log(payload);
    // Extract user information
    const { sub:googleId, email, name, picture } = payload;

    if (!email) {
      throw new AuthenticationError('Google account does not have an email address.');
    }

    // Check if the user already exists, or create a new user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: name,
        email,
        googleId,
        profilePicture: picture,
      });
      await user.save();
    }

    return user;
  }
}
