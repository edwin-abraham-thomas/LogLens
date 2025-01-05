import { Stream } from "../../types/stream";

export interface GetLogsRequest {
  streams: Stream[];
  containerIds: string[];
  page: number;
  pageSize: number;
}
