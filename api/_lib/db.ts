import type { Db, MongoClient as MongoClientType } from "mongodb";

let client: MongoClientType | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI không được cấu hình");

  // Use require to avoid static bundling issues with Vercel
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MongoClient } = require("mongodb") as typeof import("mongodb");

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    maxPoolSize: 1,
  });

  await client.connect();
  db = client.db();
  return db;
}
