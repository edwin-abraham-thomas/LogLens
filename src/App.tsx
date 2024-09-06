import { createDockerDesktopClient } from "@docker/extension-api-client";
import Divider from "@mui/material/Divider";
import "./styles.css";
import { Filter } from "./components/Filter";
import { useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";
import { LogsContainer } from "./components/LogsContainer";
import { Box, Typography } from "@mui/material";

const FILTER_CRITERIA_LOCAL_STORAGE_KEY = "LogLens_FilterCriteria";

const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>();

  useEffect(() => {
    const presetFilterCriteriaString = localStorage.getItem(
      FILTER_CRITERIA_LOCAL_STORAGE_KEY
    );
    if (
      presetFilterCriteriaString !== null &&
      presetFilterCriteriaString !== "" &&
      presetFilterCriteriaString !== undefined
    ) {
      setFilterCriteria(
        JSON.parse(presetFilterCriteriaString) satisfies FilterCriteria
      );
    } else {
      setFilterCriteria({
        selectedContainers: [],
        stderr: true,
        stdout: true,
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem(
        FILTER_CRITERIA_LOCAL_STORAGE_KEY,
        JSON.stringify(filterCriteria)
      );
    }, 10);
  }, [filterCriteria]);

  return (
    <Box sx={{ height: "95vh", display: "flex", flexDirection: "column" }}>
      <div className="flex items-center">
        <Typography variant="h2">Log Lens</Typography>
        <div className="spacer"></div>
        {filterCriteria && (
          <Filter
            ddClient={useDockerDesktopClient()}
            setFilterCriteria={setFilterCriteria}
            filterCriteria={filterCriteria}
          />
        )}
      </div>
      <Divider />
      <LogsContainer
        ddClient={useDockerDesktopClient()}
        filterCriteria={filterCriteria}
      />
    </Box>
  );
}
