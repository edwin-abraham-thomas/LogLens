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
      .map((e) => {
        const splitIndex = e.indexOf(" ");
        const time = e.slice(0, splitIndex);
        const log = e.slice(splitIndex + 1);
        return {
          timestamp: new Date(time),
          containerId: container.Id,
          containerName: container.Names[0].replace(/^\//, ""),
          log: log,
          stream: "stdout",
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
      .map((e) => {
        const splitIndex = e.indexOf(" ");
        const time = e.slice(0, splitIndex);
        const log = e.slice(splitIndex + 1);
        return {
          timestamp: new Date(time),
          containerId: container.Id,
          containerName: container.Names[0].replace(/^\//, ""),
          log: log,
          stream: "stdrr",
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