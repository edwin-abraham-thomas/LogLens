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
  const logsRef= useRef<Log[]>([]);
  logsRef.current = logs;

  const filter: FilterCriteria = {
    selectedContainers: [
      {
        Id: "aa7e768d236c26d307c8e1a8e44bb0494476addeac3cb56da759a19638f33596",
        Image: "temperatureservice",
        Names: ["temperatureservice-1"],
      },
      {
        Id: "7182d15c6024ea655fc6d0cf0d053a01b6366947c7e9c7bf8c44c6cafdcda27d",
        Image: "weathersummaryservice",
        Names: ["weathersummaryservice-1"],
      },
      {
        Id: "f92ee76d37c46e29d8c937431821355b2086c94fee180b8fa96de40bb9b292bf",
        Image: "weatherforecast",
        Names: ["weatherforecast-1"],
      },
    ],
    stdout: true,
    stderr: true,
  };

  useEffect(() => {
    const listener = LogService.setLogListener(filter, logsRef, setLogs);
    console.log("rerender useEffect")
    return () => {
      listener.close();
    };
  }, []);

  return (
    <Box sx={{ height: "95vh", display: "flex", flexDirection: "column" }}>
      <div className="flex items-center">
        <Typography variant="h2">Log Lens</Typography>
      </div>
      <Divider />
      <div>
        {logs.map((log) => (
          <pre>{log.log}</pre>
        ))}
      </div>
    </Box>
  );
}
