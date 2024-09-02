import {
  DockerDesktopClient,
  ExecResult,
} from "@docker/extension-api-client-types/dist/v1";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { useEffect, useState } from "react";
import { Log } from "../interfaces/Log";

type prop = {
  ddClient: DockerDesktopClient;
  filterCriteria: FilterCriteria | undefined;
};

export function Logs({ ddClient, filterCriteria }: prop) {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const execPromises = filterCriteria?.selectedContainerIds.map(
      (containerId) => {
        return new Promise<Log[]>((resolve, reject) => {
          ddClient.docker.cli
            .exec("logs", ["--timestamps", containerId])
            .then((execResult: ExecResult) => {
              const logs = parseLogs(execResult, containerId);
              resolve(logs);
            })
            .catch((err) => reject(err));
        });
      }
    );

    if (!execPromises) {
      return;
    }

    Promise.allSettled(execPromises).then((result: PromiseSettledResult<Log[]>[]) => {
      const allLogs: Log[] = (result as PromiseFulfilledResult<Log[]>[]).reduce((acc: Log[], res: any) => {
        acc.concat(res.value)
      }, [])
      
      console.log('Logs: ', allLogs)
      const sortedLogs = result
      .map((res: any) => res.value)
      .sort((a: Log, b: Log) => a.timestamp?.getTime() - b.timestamp?.getTime())
      setLogs(sortedLogs);
    });
  }, [filterCriteria]);

  return (
    <>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </>
  );
}

function parseLogs(execResult: ExecResult, containerId: string): Log[] {
  return execResult.stdout
    .split("\n")
    .filter((e) => e)
    .map((e) => {
      const splitIndex = e.indexOf(" ");
      const time = e.slice(0, splitIndex);
      const log = e.slice(splitIndex + 1);
      return {
        containerId: containerId,
        timestamp: new Date(time),
        log: log,
      };
    });
}
