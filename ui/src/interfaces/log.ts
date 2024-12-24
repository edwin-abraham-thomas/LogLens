import { Stream } from "../types/stream";

export interface Log{
    logId: string;
    containerId: string;
    containerName: string;
    log: string;
    timestamp: Date
    stream: Stream
}