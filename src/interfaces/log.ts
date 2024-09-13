export interface Log{
    containerId: string;
    containerName: string;
    log: string;
    timestamp: Date
    stream: "stdout" | "stdrr"
}