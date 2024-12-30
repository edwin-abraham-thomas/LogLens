import { ObjectId } from "mongodb";

export interface LogDetails {
  _id: ObjectId;
  containerId: string
  timestamp: Date;
  streamType: "stdout" | "stderr" | "unknown";
  log: string;
  orderingKey: number;
  containerName: string;
}
