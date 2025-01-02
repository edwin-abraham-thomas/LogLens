import { Log } from "../interfaces/log";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { DdClientProvider } from "./ddClientProvider";
import { GetLogsRequest } from "../interfaces/requests/get-logs-request";
import { Stream } from "../types/stream";
import { Constants } from "../constants";

export class LogService {
  public static async getLogs(
    filter: FilterCriteria,
    setLogs: (current: Log[]) => void
  ) {
    const ddClient = DdClientProvider.getClient();

    const streams: Stream[] = [];
    if (filter.stdout) {
      streams.push("stdout");
    }
    if (filter.stderr) {
      streams.push("stdrr");
    }

    const request: GetLogsRequest = {
      containerIds: filter.selectedContainers.map((c) => c.Id),
      streams: streams,
      page: filter.page ?? Constants.DEFAULT_PAGE, //TODO: Remove thes defaults
      pageSize: filter.pageSize ?? Constants.DEFAULT_PAGE_SIZE, //TODO: Remove thes defaults
    };
    const logs = (await ddClient.extension.vm?.service?.post(
      "/logs",
      request
    )) as Log[];
    setLogs(logs);
  }
}
