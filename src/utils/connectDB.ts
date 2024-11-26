import dotenv from "dotenv";
import mongoose from "mongoose";

// import logger from "./logger/logger.js";


dotenv.config();


// connection to the database
async function connectToMongoDB(){
    
    const mongoURI = `mongodb+srv://simrandeep2012:${process.env.MONGO_PASSWORD}@auth-server.wiwhj.mongodb.net/oauth?retryWrites=true&w=majority&appName=auth-server`

    try {
      await mongoose.connect(mongoURI);
      // logger.info('Connected to MongoDB successfully');
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      // logger.error('Error connecting to MongoDB:', error);
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Error connecting to MongoDB');
       
    }
}

  export default connectToMongoDB;


  