import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const uri = process.env.MONGODB_URI;
  if (!uri) return res.status(500).json({ error: "No MONGODB_URI" });

  let client: MongoClient | null = null;
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const count = await db.collection("contacts").countDocuments();
    return res.json({
      connected: true,
      dbName: db.databaseName,
      collections: collections.map(c => c.name),
      contactsCount: count,
    });
  } catch (err: any) {
    return res.status(500).json({ connected: false, error: err?.message });
  } finally {
    if (client) await client.close();
  }
}
