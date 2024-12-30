import { Db } from "mongodb";
import { initializeDatabase } from "./data-access/database.js";
import { LogInjestJob } from "./jobs/log-ingest-job.js";
import Dockerode from "dockerode";
import { dockerSocketFile } from "./constants.js";

async function startApp() {
  const db: Db | undefined = await initializeDatabase();

  if(!db) {
    console.log("Failed to initialize Db");
    return;
  }  
  var dockerClient = new Dockerode({ socketPath: dockerSocketFile });

  // Start jobs
  new LogInjestJob(db, dockerClient).start()
}

startApp();
