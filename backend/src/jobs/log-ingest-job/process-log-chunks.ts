import { LogDetails, Stream } from "../../models/log-details";

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
          streamType = "stdout";
      }

      const timestampRegex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)/;
      const match = l.match(timestampRegex);
      let time: Date;
      if(match !== null){
        time = new Date(match[0])
      }
      else{
        console.error(`Failed to extract timestamp from log: ${l}`);
        time = new Date();
      }

      const splitIndex = l.indexOf(" ");
      const log = l.slice(splitIndex + 1);
      return {
        timestamp: time,
        stream: streamType,
        log: log,
        orderingKey: time.getTime() + (i/10)
      } as LogDetails;
    });
}
