import { Stream } from "./log-details";

export interface GetLogsRequest {
  streams: Stream[];
  containerIds: string[];
  page: number;
  pageSize: number;
}
