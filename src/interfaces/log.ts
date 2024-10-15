import { Stream } from "../types/stream";

export interface Log{
    containerId: string;
    containerName: string;
    log: string;
    timestamp: Date
    stream: Stream
}