import {
  DockerDesktopClient,
  ExecProcess,
  ExecResult,
} from "@docker/extension-api-client-types/dist/v1";
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

    const listeners = filter.selectedContainers.map((container) => {
      const appendLog = (newLogString: string | undefined, stream: Stream) => {
        if (!newLogString) {
          return;
        }
        const newLogs: Log[] = LogService.parseLog(newLogString, container, stream);
        setLog([...logs.current, ...newLogs]);
      };

      return client.docker.cli.exec(
        "logs",
        ["-f", "-t", container.Id],
        {
          stream: {
            onOutput(data): void {
              setTimeout(() => {
                if(filter.stdout)
                  appendLog(data.stdout, "stdout");
                if(filter.stderr)
                appendLog(data.stderr, "stdrr");
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
        }
      );
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
        // console.log("t:", time, " ", "m:", log);
        return {
          timestamp: new Date(time),
          containerId: container.Id,
          containerName: container.Names[0].replace(/^\//, ""),
          stream: stream,
          log: log,
        };
      });

    return logs;
  }
}
