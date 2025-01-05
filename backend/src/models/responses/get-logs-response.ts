import { LogDetails } from "../log-details";

export interface GetLogsResponse {
  logs: LogDetails[];
  estimatedRowCount: number;
}
