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
import { Backdrop, CircularProgress } from "@mui/material";

type prop = {
  ddClient: DockerDesktopClient;
  filterCriteria: FilterCriteria | undefined;
  refreshtrigger: boolean;
};

export function LogsContainer({ ddClient, filterCriteria, refreshtrigger }: prop) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const execPromises = filterCriteria?.selectedContainers.map((container) => {
      return new Promise<Log[]>((resolve, reject) => {
        setLoading(true);
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
          (a, b) => b.timestamp?.getTime() - a.timestamp?.getTime()
        );
        setLogs(sortedLogs);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error occured", error);
        setLoading(false);
      });
  }, [filterCriteria, refreshtrigger]);

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <LogsTable logs={logs} />
    </>
  );
}
