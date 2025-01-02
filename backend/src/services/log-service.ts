import { LogsRepository } from "../data-access/database";
import { GetLogsRequest } from "../models/get-logs-request";
import { LogDetails } from "../models/log-details";

export class LogService {
  private readonly _logsRepo: LogsRepository;

  constructor() {
    this._logsRepo = new LogsRepository();
  }

  public async getLogs(req: GetLogsRequest): Promise<LogDetails[]>{
    const skip = (req.page)*req.pageSize;
    const limit = req.pageSize
    console.log("Skip: ", skip, " Limit: ", limit);
    return await this._logsRepo.getLogs(req, skip, limit);
  }
}
