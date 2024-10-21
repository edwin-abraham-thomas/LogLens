import { ExecResult } from "@docker/extension-api-client-types/dist/v1";
import { Log } from "../interfaces/log";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { DdClientProvider } from "./ddClientProvider";
import { LogParser } from "./logParser";

export class LogService {
  public static getLogs(
    filter: FilterCriteria,
    setLogs: (current: Log[]) => void
  ) {
    const ddClient = DdClientProvider.getClient();

    const execPromises = filter?.selectedContainers.map((container) => {
      return new Promise<Log[]>((resolve, reject) => {
        ddClient.docker.cli
          .exec("logs", ["--timestamps", container.Id])
          .then((execResult: ExecResult) => {
            const stdoutLogs = LogParser.parseStdoutLogs(
              execResult,
              container,
              filter
            );
            const stderrLogs = LogParser.parseStderrLogs(
              execResult,
              container,
              filter
            );
            resolve([...stdoutLogs, ...stderrLogs]);
          })
          .catch((err) => reject(err));
      });
    });

    if (!execPromises) {
      return;
    }

    Promise.allSettled(execPromises)
      .then((results: PromiseSettledResult<Log[]>[]) => {
        let allLogs: Log[] = [];
        for (const result of results) {
          if (result.status === "fulfilled") {
            allLogs = allLogs.concat(result.value);
          } else {
            console.error(
              "Error getting logs for a container: ",
              result.reason
            );
          }
        }

        const sortedLogs = allLogs.sort(
          (a, b) => a.timestamp?.getTime() - b.timestamp?.getTime()
        )
        .reverse();

        setLogs(sortedLogs);
      })
      .catch((error) => {
        console.log("Error occured", error);
      });
  }
}
