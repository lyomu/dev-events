import mongoose from 'mongoose';

/**
 * Global type declaration for cached mongoose connection
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global mongoose cache object
 * This is necessary to prevent multiple connections in development mode
 * due to Next.js hot-reloading
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * 
 * This function implements connection caching to reuse existing connections
 * and prevent connection pool exhaustion during development (hot-reloading)
 * 
 * @returns Promise<mongoose.Connection> - Active MongoDB connection
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if one doesn't exist
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable mongoose buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    // Wait for connection to establish and cache it
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
