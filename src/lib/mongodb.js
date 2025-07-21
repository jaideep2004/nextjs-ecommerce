import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); 

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jai2004bgmi:jai2004nextjs@nextjs-ecommerce.rkuzuet.mongodb.net/?retryWrites=true&w=majority&appName=nextjs-ecommerce';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
} 
 
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) { 
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;