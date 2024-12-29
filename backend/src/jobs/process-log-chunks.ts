function processLogs(chunk) {
  //   const LOG_HEADER_SIZE = 8;
  //   const logLine = chunk.toString("utf-8", LOG_HEADER_SIZE).trim();
  return chunk
    .toString("utf-8")
    .split("\n")
    .filter((e) => e)
    .map((l) => {
      const buf = Buffer.from(l);
      const streamTypeByte = buf.readUInt8(0); // Byte 1

      let streamType;
      switch (streamTypeByte) {
        case 0x01:
          streamType = "stdout";
          break;
        case 0x02:
          streamType = "stderr";
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
        streamType: streamType,
        log: log
      };
    });
}

module.exports = {
  processLogs,
};
