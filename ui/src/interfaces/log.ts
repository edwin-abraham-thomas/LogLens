import { Stream } from "../types/stream";

export interface Log{
    _id: string;
    containerId: string;
    containerName: string;
    log: string;
    timestamp: Date
    stream: Stream
}