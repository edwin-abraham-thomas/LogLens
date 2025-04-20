import { Stream } from "../../types/stream";

export interface GetLogsRequest {
  streams: Stream[];
  containerIds: string[];
  filterToLastNMinutes: number;
  page: number;
  pageSize: number;
}
