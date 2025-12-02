import mongoose from "mongoose";

// Define the MongoDB connection URI type
type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the global type to include our mongoose cache
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global cache for the mongoose connection
 * This is necessary because in development, Next.js hot reloading can
 * create new connections on each reload, which can quickly exhaust
 * the database connection pool.
 */
const cached: MongooseConnection = global.mongoose || {
  conn: null,
  promise: null,
};

// Store the cache globally in development to persist across hot reloads
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Returns the cached connection if available, otherwise creates a new one
 *
 * @returns Promise<typeof mongoose> - The mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If no cached promise exists, create a new connection
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 5, // Minimum number of connections in the pool
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 10000, // Timeout for selecting a server
    };

    // Create and cache the connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI as string, options)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        // Reset the promise cache on error
        cached.promise = null;
        throw error;
      });
  }

  try {
    // Await the cached promise and store the connection
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise cache if connection fails
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
