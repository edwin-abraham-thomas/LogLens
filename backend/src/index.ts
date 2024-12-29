import { Db } from "mongodb";
import { initializeDatabase } from "./data-access/database.js";
import { startLogIngestJob } from "./jobs/log-ingest-job.js";

async function startApp() {
  const db: Db | undefined = await initializeDatabase();

  if(!db) {
    console.log("failed to initialize Db");
    return;
  }
  startLogIngestJob(db);
}

startApp();
