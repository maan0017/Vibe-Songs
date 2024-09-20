import mongoose from 'mongoose';
import { DB_COLLECTION_NAME, DB_NAME } from '../constants.js';

const connectMongooseDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
    console.log(`mongoDB connected !! DB Host : ${connectionInstance.connection.host}`);
  } catch (err) {
    console.log('mongoDB connection failed : ', err);
    process.exit(1);
  }
};

export default connectMongooseDB;
