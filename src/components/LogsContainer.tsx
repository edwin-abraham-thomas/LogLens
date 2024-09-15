import {
  DockerDesktopClient,
  ExecResult,
} from "@docker/extension-api-client-types/dist/v1";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { useEffect, useState } from "react";
import { Log } from "../interfaces/log";
import { Container } from "../interfaces/container";
import { LogsTable } from "./LogsTable";
import { LogParser } from "../services/logParser";

type prop = {
  ddClient: DockerDesktopClient;
  filterCriteria: FilterCriteria | undefined;
};

export function LogsContainer({ ddClient, filterCriteria }: prop) {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const execPromises = filterCriteria?.selectedContainers.map((container) => {
      return new Promise<Log[]>((resolve, reject) => {
        ddClient.docker.cli
          .exec("logs", ["--timestamps", container.Id])
          .then((execResult: ExecResult) => {
            const stdoutLogs = LogParser.parseStdoutLogs(
              execResult,
              container,
              filterCriteria
            );
            const stderrLogs = LogParser.parseStderrLogs(
              execResult,
              container,
              filterCriteria
            );
            resolve([...stdoutLogs, ...stderrLogs]);
          })
          .catch((err) => reject(err));
      });
    });

    if (!execPromises) {
      return;
    }

    Promise.allSettled(execPromises).then(
      (results: PromiseSettledResult<Log[]>[]) => {
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
          (a, b) => b.timestamp?.getTime() - a.timestamp?.getTime()
        );
        setLogs(sortedLogs);
      }
    );
  }, [filterCriteria]);

  return (
    <>
      <LogsTable logs={logs} />
    </>
  );
}
