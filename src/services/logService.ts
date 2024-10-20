import { ExecProcess } from "@docker/extension-api-client-types/dist/v1";
import { Log } from "../interfaces/log";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { MutableRefObject } from "react";
import { Container } from "../interfaces/container";
import { Stream } from "../types/stream";
import { DdClientProvider } from "./ddClientProvider";

export class LogService {
  public static setLogListeners(
    filter: FilterCriteria,
    logs: MutableRefObject<Log[]>,
    setLog: (current: Log[]) => void
  ): ExecProcess[] {
    const client = DdClientProvider.getClient();
    setLog([]);

    // if (!filter.selectedContainers || filter.selectedContainers.length == 0) {
    //   console.log("emptying logs");
    //   setLog([]);
    // }

    const listeners = filter.selectedContainers.map((container) => {
      const appendLog = (newLogString: string | undefined, stream: Stream) => {
        if (!newLogString) {
          return;
        }
        const newLogs: Log[] = LogService.parseLog(
          newLogString,
          container,
          stream
        );
        console.log(
          "appending for ",
          newLogs[0].containerName,
          " ",
          newLogs.map((l) => l.containerName),
          " stream: ",
          stream
        );
        const sortedLogs = LogService.sortLogs([...logs.current, ...newLogs]);
        console.log("sorted logs for ", container.Names, sortedLogs);
        setLog(sortedLogs);
        console.log("append logs for ", container.Names, logs);
      };

      return client.docker.cli.exec("logs", ["-f", "-t", container.Id], {
        stream: {
          onOutput(data): void {
            console.log("received logs for ", container.Names);
            setTimeout(() => {
              if (filter.stdout) appendLog(data.stdout, "stdout");
              if (filter.stderr) appendLog(data.stderr, "stdrr");
            }, 0);
          },
          onError(error: unknown): void {
            client.desktopUI.toast.error("An error occurred");
            console.log(error);
          },
          onClose(exitCode) {
            console.log("onClose with exit code " + exitCode);
          },
          splitOutputLines: false,
        },
      });
    });

    return listeners;
  }

  private static parseLog(
    logsString: string,
    container: Container,
    stream: Stream
  ): Log[] {
    const logs: Log[] = logsString
      .split("\n")
      .filter((e) => e)
      .map((logString) => {
        const splitIndex = logString.indexOf(" ");
        const time = logString.slice(0, splitIndex);
        const log = logString.slice(splitIndex + 1);
        return {
          timestamp: new Date(time),
          containerId: container.Id,
          containerName: container.Names[0].replace(/^\//, ""),
          stream: stream,
          log: log,
        };
      });
      console.log("parsed logs for ", container.Names, " stream: ",  stream);
    return logs;
  }

  private static sortLogs(logs: Log[]): Log[] {
    return logs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}
