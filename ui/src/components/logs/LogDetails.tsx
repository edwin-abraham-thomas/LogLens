import { Typography } from "@mui/material";
import { useEffect } from "react";
import { Log } from "../../interfaces/log";
import { LogParser } from "../../services/logParser";

type prop = {
  log: Log;
};

export function LogDetails({ log }: prop) {

  return (
    <>
      <div style={{ maxWidth: "90vw", minWidth: "40vw", margin: "1rem" }}>
        <Typography variant="h2" sx={{ marginBottom: "2rem" }}>
          Details
        </Typography>
        <LogField
          fieldName="Timestamp"
          value={log.timestamp.toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          })}
        ></LogField>
        <LogField fieldName="Container" value={log.containerName}></LogField>
        <LogMessage log={log}></LogMessage>
      </div>
    </>
  );
}

function LogField(prop: { fieldName: string; value: string }) {
  return (
    <>
      <div
        className="flex"
        style={{ gap: "1rem", whiteSpace: "pre-wrap", marginBottom: "0.5rem" }}
      >
        <Typography variant="body1">{prop.fieldName}</Typography>
        <Typography variant="body1">:</Typography>
        <Typography variant="body1">{prop.value}</Typography>
      </div>
    </>
  );
}

function LogMessage(prop: { log: Log }) {
  const logObejct = LogParser.tryParseJson(prop.log.log);
  if (logObejct !== null) {
    return (
      <>
        <div
          className="flex"
          style={{
            gap: "1rem",
            whiteSpace: "pre-wrap",
            marginBottom: "0.5rem",
          }}
        >
          <Typography variant="body1">Message</Typography>
          <Typography variant="body1">:</Typography>
          <Typography variant="body1">
            {JSON.stringify(logObejct, null, 4)}
          </Typography>
        </div>
      </>
    );
  }
  return (
    <>
      <div
        className="flex"
        style={{ gap: "1rem", whiteSpace: "pre-wrap", marginBottom: "0.5rem" }}
      >
        <Typography variant="body1">Message</Typography>
        <Typography variant="body1">:</Typography>
        <div>
          <Typography variant="body1">{prop.log.log}</Typography>
        </div>
      </div>
    </>
  );
}