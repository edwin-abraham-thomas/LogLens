import { Box, Typography } from "@mui/material";
import { Log } from "../interfaces/log";

type prop = {
  log: Log;
};

export function LogDetails({ log }: prop) {
  return (
    <>
      <div style={{ maxWidth: "70rem", margin: "1rem" }}>
        <Typography variant="h2">Details</Typography>
        <pre>
          <div style={{ textWrap: "wrap", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(log.log, null, 4)}
          </div>
        </pre>
      </div>
    </>
  );
}
