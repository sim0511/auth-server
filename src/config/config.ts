import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const requiredEnv = ['PORT','PORT', 'NODE_ENV', 'AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY','JWT_SECRET'];

// Validate required environment variables
requiredEnv.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });

  // Export environment variables as a configuration object
  export const config = {
    PORT: parseInt(process.env.PORT || '9000', 10),
    Node_ENV: process.env.NODE_ENV || 'development',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
    tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
    JWT_SECRET: process.env.JWT_SECRET,
  };
