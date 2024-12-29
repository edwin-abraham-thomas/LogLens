import { ObjectId } from "mongodb";

export interface LogDetails {
  _id: ObjectId;
  timestamp: Date;
  streamType: "stdout" | "stderr" | "unknown";
  log: string;
  orderingKey: number;
}
