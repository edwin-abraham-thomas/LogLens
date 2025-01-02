import { ObjectId } from "mongodb";

export interface LogDetails {
  _id: ObjectId;
  containerId: string
  timestamp: Date;
  stream: Stream;
  log: string;
  orderingKey: number;
  containerName: string;
}

export type Stream = "stdout" | "stdrr" | "unknown"