import mongoose from "mongoose";

let cached = (global as any).mongooseConn as mongoose.Connection | null;

export async function connectDB() {
  if (cached && cached.readyState === 1) return cached;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI không được cấu hình");

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    maxPoolSize: 1, // Vercel serverless — chỉ cần 1 connection
  });
  cached = conn.connection;
  (global as any).mongooseConn = cached;
  return cached;
}
