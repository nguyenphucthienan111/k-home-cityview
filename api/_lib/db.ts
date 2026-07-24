import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI không được cấu hình");

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    maxPoolSize: 1,
  });

  await client.connect();
  db = client.db(); // uses DB name from URI
  return db;
}
