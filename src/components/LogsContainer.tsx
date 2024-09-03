import {
  DockerDesktopClient,
  ExecResult,
} from "@docker/extension-api-client-types/dist/v1";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { useEffect, useState } from "react";
import { Log } from "../interfaces/Log";
import { Container } from "../interfaces/container";
import { LogsTable } from "./LogsTable";

type prop = {
  ddClient: DockerDesktopClient;
  filterCriteria: FilterCriteria | undefined;
};

export function LogsContainer({ ddClient, filterCriteria }: prop) {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const execPromises = filterCriteria?.selectedContainers.map(
      (container) => {
        return new Promise<Log[]>((resolve, reject) => {
          ddClient.docker.cli
            .exec("logs", ["--timestamps", container.Id])
            .then((execResult: ExecResult) => {
              const logs = parseLogs(execResult, container);
              resolve(logs);
            })
            .catch((err) => reject(err));
        });
      }
    );

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

        const sortedLogs = allLogs
          .sort(
            (a, b) => a.timestamp?.getTime() - b.timestamp?.getTime()
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

function parseLogs(execResult: ExecResult, container: Container): Log[] {
  return execResult.stdout
    .split("\n")
    .filter((e) => e)
    .map((e) => {
      const splitIndex = e.indexOf(" ");
      const time = e.slice(0, splitIndex);
      const log = e.slice(splitIndex + 1);
      return {
        timestamp: new Date(time),
        containerId: container.Id,
        containerName: container.Names[0].replace(/^\//, ''),
        log: log,
      };
    });
}
