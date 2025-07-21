import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); 

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jai2004bgmi:jai2004nextjs@nextjs-ecommerce.rkuzuet.mongodb.net/?retryWrites=true&w=majority&appName=nextjs-ecommerce';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

console.log('MongoDB connection string available:', !!MONGODB_URI);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) { 
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new database connection...');
    
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('MongoDB connection successful');
        return mongoose;
      });
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  try {
    console.log('Waiting for MongoDB connection promise to resolve...');
    cached.conn = await cached.promise;
    console.log('MongoDB connection established successfully');
  } catch (e) {
    cached.promise = null;
    console.error('Error establishing MongoDB connection:', e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;