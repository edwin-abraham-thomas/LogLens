import { createDockerDesktopClient } from "@docker/extension-api-client";
import "./styles.css";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { LogService } from "./services/logService";
import { Log } from "./interfaces/log";
import { FilterCriteria } from "./interfaces/filterCriteria";

const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export function App() {
  LogService._ddClient = useDockerDesktopClient();
  const [logs, setLogs] = useState<Log[]>([]);
  const logsRef = useRef<Log[]>([]);
  logsRef.current = logs;

  const filter: FilterCriteria = {
    selectedContainers: [
      {
        Id: "89f834d7bbf722c75a4100188572f8ad13a775f57ad446ad2f1a75fca164fc9f",
        Image: "temperatureservice",
        Names: ["temperatureservice-1"],
      },
      {
        Id: "44edfa5c1cc1cf14bc29a7fcfa892bd4848b4886c00b5d461ca22935946a2a8b",
        Image: "weathersummaryservice",
        Names: ["weathersummaryservice-1"],
      },
      {
        Id: "d227dd62870b5b3cc8c190d54b374d2b104a1ac5b328b1ea938edd98d8ad8f17",
        Image: "weatherforecast",
        Names: ["weatherforecast-1"],
      },
    ],
    stdout: true,
    stderr: true,
  };

  useEffect(() => {
    const listener = LogService.setLogListeners(filter, logsRef, setLogs);
    console.log("rerender useEffect");

    return () => {
      listener.forEach((listener) => {
        listener.close();
      });
      logsRef.current = []
    };
  }, []);

  console.log(logs);

  return (
    <Box sx={{ height: "95vh", display: "flex", flexDirection: "column" }}>
      <div className="flex items-center">
        <Typography variant="h2">Log Lens</Typography>
      </div>
      <Divider />
      <div>
        {logs.map((log, index) => (
          <div key={index}>
            <pre>
              {index}
              {" | "}
              {log.timestamp.toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                fractionalSecondDigits: 3,
              })}
              {" -- "}
              {log.containerName}
              {" -- "}
              {log.log}
            </pre>
          </div>
        ))}
      </div>
    </Box>
  );
}
