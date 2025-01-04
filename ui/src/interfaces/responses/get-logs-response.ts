import { Log } from "../log";

export interface GetLogsResponse {
  logs: Log[];
  estimatedRowCount: number;
}
