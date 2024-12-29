import { MongoClient, ServerApiVersion } from "mongodb";
import { mongoConnectionString, mongodbname, logsCollectionName } from "../constants";

export async function initializeDatabase() {
  const client = new MongoClient(mongoConnectionString, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
  });

  const db = client.db(mongodbname);
  const collections = await db.listCollections({ name: logsCollectionName }).toArray();
  let collection;
  if (collections.length === 0) {
    collection = await db.createCollection(logsCollectionName);
  } else {
    collection = db.collection(logsCollectionName);
  }

  if (collection) {
    console.log(
      "Database, collection created successfully"
    );
    return db;
  } else {
    console.log("Error creating collection");
  }
}
