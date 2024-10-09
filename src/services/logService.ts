import { DockerDesktopClient } from "@docker/extension-api-client-types/dist/v1";
import { Log } from "../interfaces/log";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { MutableRefObject } from "react";

export class LogService {
  public static _ddClient: DockerDesktopClient;

  public static setLogListener(
    filter: FilterCriteria,
    logs: MutableRefObject<Log[]>,
    setLog: (current: Log[]) => void
  ) {
    const client = this._ddClient;

    const appendLog = (newLog: Log) => {
      setLog([...logs.current, newLog]);
    };

    return this._ddClient.docker.cli.exec(
      "logs",
      [
        "-f",
        "-t",
        "3ca9761d9539ad1505e56185a5397d39102a374625fdabab0d036a87a297d514",
      ],
      {
        stream: {
          onOutput(data): void {
            if (data.stdout) {
              const newLogStdout = LogService.parseLog(data.stdout);
              console.log("t:", newLogStdout.timestamp, "--", "l:", newLogStdout.log)
              setTimeout(() => appendLog(newLogStdout), 1);
              return;
            }
            if (data.stderr) {
              const newLogStderr = LogService.parseLog(data.stderr);
              setTimeout(() => appendLog(newLogStderr), 0);
              return;
            }
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
  }

  private static parseLog(logString: string): Log {
    const splitIndex = logString.indexOf(" ");
    const time = logString.slice(0, splitIndex);
    const log = logString.slice(splitIndex + 1);
    return {
      timestamp: new Date(time),
      containerId: "Dummy",
      containerName: "Dummy",
      stream: "stdout",
      log: log,
    };
  }
}
