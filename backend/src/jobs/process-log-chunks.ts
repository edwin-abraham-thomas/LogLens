import { LogDetails, Stream } from "../models/log-details";

export function processLogChunks(chunk : Buffer): LogDetails[] {
  //   const LOG_HEADER_SIZE = 8;
  //   const logLine = chunk.toString("utf-8", LOG_HEADER_SIZE).trim();
  return chunk
    .toString("utf-8")
    .split("\n")
    .filter((e) => e)
    .map((l, i) => {
      const buf = Buffer.from(l);
      const streamTypeByte = buf.readUInt8(0); // Byte 1

      let streamType : Stream;
      switch (streamTypeByte) {
        case 0x01:
          streamType = "stdout";
          break;
        case 0x02:
          streamType = "stdrr";
          break;
        default:
          streamType = "unknown";
      }
      // const payloadSize = chunk.readUInt32BE(4); // Bytes 5-8

      const logPayload = l.substring(8); // Remove header

      const timestampSplitIndex = logPayload.indexOf(" ");
      const time = new Date(logPayload.slice(0, timestampSplitIndex));
      const log = logPayload.slice(timestampSplitIndex + 1);
      return {
        timestamp: time,
        stream: streamType,
        log: log,
        orderingKey: time.getTime() + (i/10)
      } as LogDetails;
    });
}
