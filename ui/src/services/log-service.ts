import { Log } from "../interfaces/log";
import { FilterCriteria } from "../interfaces/filter-criteria";
import { DdClientProvider } from "./dd-client-provider";
import { GetLogsRequest } from "../interfaces/requests/get-logs-request";
import { Stream } from "../types/stream";
import { GetLogsResponse } from "../interfaces/responses/get-logs-response";

export class LogService {
  public static async getLogs(
    filter: FilterCriteria,
    setLogs: (current: Log[]) => void
  ) {
    if (filter.selectedContainers.length === 0) {
      setLogs([]);
      return;
    }
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
      page: filter.page,
      pageSize: filter.pageSize,
    };
    console.log("getting logs. Request:", request);
    const getLogsResponse = (await ddClient.extension.vm?.service?.post(
      "/logs",
      request
    )) as GetLogsResponse;
    setLogs(getLogsResponse.logs);
  }
}
