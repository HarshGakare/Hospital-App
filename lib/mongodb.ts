import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  // Reuse an existing open connection.
  if (cached.conn) {
    return cached.conn;
  }

  // Reuse an in-flight connection attempt instead of starting a second one.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // fail fast instead of queuing ops if disconnected
      maxPoolSize: 10, // cap concurrent sockets per Mongoose instance
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next request can retry instead of being stuck on a
    // rejected promise forever.
    cached.promise = null;
        console.error("❌ MongoDB Connection Error:", err);
    throw err;
  }

  return cached.conn;
}
