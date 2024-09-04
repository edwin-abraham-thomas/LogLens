import { createDockerDesktopClient } from "@docker/extension-api-client";
import Divider from "@mui/material/Divider";
import "./styles.css";
import { Filter } from "./components/Filter";
import { useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";
import { LogsContainer } from "./components/LogsContainer";
import { Box, Typography } from "@mui/material";

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    selectedContainers: [],
    stderr: true,
    stdout: true,
  });

  return (
    <Box sx={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center">
        <Typography variant="h2">Log Lens</Typography>
        <div className="spacer"></div>
        <Filter
          ddClient={useDockerDesktopClient()}
          setFilterCriteria={setFilterCriteria}
          filterCriteria={filterCriteria}
        />
      </div>
      <Divider />
      <LogsContainer
        ddClient={useDockerDesktopClient()}
        filterCriteria={filterCriteria}
      />
    </Box>
  );
}
