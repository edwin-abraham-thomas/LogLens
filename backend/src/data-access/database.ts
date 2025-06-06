import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import {
  mongoConnectionString,
  mongodbname,
  logsCollectionName,
} from "../constants";
import { LogDetails } from "../models/log-details";
import { GetLogsRequest } from "../models/requests/get-logs-request";
import { GetLogsResponse } from "../models/responses/get-logs-response";

export abstract class Database {
  private static _db: Db;

  protected getDb(): Db {
    if (!Database._db) {
      const client = new MongoClient(mongoConnectionString, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: false,
          deprecationErrors: true,
        },
      });
      Database._db = client.db(mongodbname);
    }

    return Database._db;
  }

  protected async initializeCollection(collectionName: string): Promise<void> {
    console.log(`initializing ${collectionName} collection`);
    const db = this.getDb();
    const collections = await db
      .listCollections({ name: collectionName })
      .toArray();
    let collection;
    if (collections.length === 0) {
      collection = await db.createCollection(collectionName);
    } else {
      collection = db.collection(collectionName);
    }

    if (collection) {
      console.log("Database, collection created successfully");
    } else {
      console.log("Error creating collection");
    }
  }
}

export class LogsRepository extends Database {
  constructor() {
    super();
  }
  public async init() {
    this.initializeCollection(logsCollectionName);
  }

  public async getLogs(
    req: GetLogsRequest,
    skip: number,
    limit: number
  ): Promise<GetLogsResponse> {
    const collection = this.getLogsCollection();
    const query: any = {
      containerId: { $in: req.containerIds },
      stream: { $in: req.streams },
    };

    if (req.filterToLastNMinutes > 0) {
      const currentTime = new Date();
      const pastTime = new Date(currentTime.getTime() - req.filterToLastNMinutes * 60000);
      query.timestamp = { $gte: pastTime };
    }

    const logs = await collection
      .find(query)
      .sort({ orderingKey: -1 })
      .skip(skip > 0 ? skip : 0)
      .limit(limit > 0 ? limit : 0)
      .toArray();

    const count = await collection.countDocuments(query);
    console.log(`Found ${count} logs`);
    return {
      logs: logs,
      estimatedRowCount: count,
    };
  }

  public async insertLogs(logs: LogDetails[]): Promise<void> {
    if (logs && logs.length > 0) {
      const collection = this.getLogsCollection();
      await collection.insertMany(logs);
      return;
    }

    console.log("Batch empty skipping db insert");
  }

  public async deleteLogs(containerId: string) {
    const collection = this.getLogsCollection();
    const filter = { containerId: containerId };
    await collection.deleteMany(filter);
  }

  public async getLogsForNonRunningContainers(runningContainerIds: string[]): Promise<LogDetails[]> {
    const collection = this.getLogsCollection();
    const query = {
      containerId: { $nin: runningContainerIds },
    };

    const logs = await collection.find(query).toArray();
    return logs;
  }

  public async deleteLogsForContainers(containerIds: string[]): Promise<number> {
    const collection = this.getLogsCollection();
    const filter = {
      containerId: { $in: containerIds },
    };

    const result = await collection.deleteMany(filter);
    console.log(`Deleted ${result.deletedCount} logs for the specified containers`);
    return result.deletedCount;
  }

  private getLogsCollection(): Collection<LogDetails> {
    const db = this.getDb();
    return db.collection<LogDetails>(logsCollectionName);
  }
}
