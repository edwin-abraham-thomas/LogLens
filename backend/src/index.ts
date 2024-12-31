import { LogInjestJob } from "./jobs/log-ingest-job.js";
import { backendApiSocketFile } from "./constants.js";
import express, { Request, Response } from 'express';
import { LogsRepository } from "./data-access/database.js";

async function start() {
  
  // Database init
  await new LogsRepository().init();

  // Start jobs
  new LogInjestJob().start();
  
  //APIs
  const app = express();
  const apiSocketFile = backendApiSocketFile;

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
  });

  app.listen(apiSocketFile, () => {
    console.log(`Server running at apiSocketFile`);
  });
}

start();
