import { ExecResult } from "@docker/extension-api-client-types/dist/v1";
import { Log } from "../interfaces/log";
import { Container } from "../interfaces/container";
import { FilterCriteria } from "../interfaces/filterCriteria";

export class LogParser {
  public static parseStdoutLogs(
    execResult: ExecResult,
    container: Container,
    filterCriteria: FilterCriteria
  ): Log[] {
    if (!filterCriteria.stdout) {
      return [];
    }
    return execResult.stdout
      .split("\n")
      .filter((e) => e)
      .map((e, index) => {
        const splitIndex = e.indexOf(" ");
        const timestamp = e.slice(0, splitIndex);
        const logString = e.slice(splitIndex + 1);
        const containerName = container.Names[0].replace(/^\//, "");
        const logId = `${containerName}-${index}`;
        return {
          timestamp: new Date(timestamp),
          containerId: container.Id,
          containerName: containerName,
          log: logString,
          stream: "stdout",
          logId: logId,
        };
      });
  }

  public static parseStderrLogs(
    execResult: ExecResult,
    container: Container,
    filterCriteria: FilterCriteria
  ): Log[] {
    if (!filterCriteria.stderr) {
      return [];
    }
    return execResult.stderr
      .split("\n")
      .filter((e) => e)
      .map((e, index) => {
        const splitIndex = e.indexOf(" ");
        const timestamp = e.slice(0, splitIndex);
        const logString = e.slice(splitIndex + 1);
        const containerName = container.Names[0].replace(/^\//, "");
        // const logId = `${containerName}-${index}`;
        const logId = crypto.randomUUID();
        return {
          timestamp: new Date(timestamp),
          containerId: container.Id,
          containerName: containerName,
          log: logString,
          stream: "stdrr",
          logId: logId
        };
      });
  }

  public static tryParseJson(str: string): object | null {
    let jsonObject: object;
    try {
      jsonObject = JSON.parse(str);
    } catch (e) {
      return null;
    }
    return jsonObject;
  }
}
