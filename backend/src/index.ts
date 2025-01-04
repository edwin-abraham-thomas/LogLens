import { LogInjestJob } from "./jobs/log-ingest-job.js";
import { backendApiSocketFile } from "./constants.js";
import express, { Request, Response } from "express";
import { LogsRepository } from "./data-access/database.js";
import fs from "fs";
import { LogService } from "./services/log-service.js";
import { GetLogsRequest } from "./models/requests/get-logs-request.js";
import { GetLogsResponse } from "./models/responses/get-logs-response.js";

async function start() {
  //#region Database init
  await new LogsRepository().init();
  //#endregion

  //#region Jobs
  new LogInjestJob().start();
  //#endregion

  //#region APIs
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // After a server is done with the unix domain socket, it is not automatically destroyed.
  // You must instead unlink the socket in order to reuse that address/path.
  // To do this, we delete the file with fs.unlinkSync()
  try {
    fs.unlinkSync(backendApiSocketFile);
    console.log("Deleted the UNIX socket file.");
  } catch (err) {
    console.log("Did not need to delete the UNIX socket file.");
  }

  app.post("/logs", async (req: Request<GetLogsRequest>, res: Response<GetLogsResponse>) => {
    console.log("Processing rquest: ", JSON.stringify(req.body));
    const logService = new LogService();
    const logs = await logService.getLogs(req.body)
    res.status(200).send(logs)
  })

  app.listen(backendApiSocketFile, () => {
    console.log(`Server running at ${backendApiSocketFile}`);
  });
  //#endregion
}

start();
