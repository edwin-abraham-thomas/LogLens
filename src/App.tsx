import { createDockerDesktopClient } from "@docker/extension-api-client";
import Divider from "@mui/material/Divider";
import "./styles.css";
import { Filter } from "./components/Filter";
import { useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";
import { LogsContainer } from "./components/LogsContainer";
import { Box, Typography } from "@mui/material";
import { Constants } from "./constants";

const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>();

  useEffect(() => {
    const presetFilterCriteriaString = localStorage.getItem(
      Constants.FILTER_CRITERIA_LOCAL_STORAGE_KEY
    );
    console.log("checking for preset filter", presetFilterCriteriaString);
    if (
      presetFilterCriteriaString !== null &&
      presetFilterCriteriaString !== "" &&
      presetFilterCriteriaString !== undefined
    ) {
      console.log(
        "setting preset filter",
        presetFilterCriteriaString != undefined
      );
      setFilterCriteria(JSON.parse(presetFilterCriteriaString));
    } else {
      console.log("setting default filter", presetFilterCriteriaString);
      setFilterCriteria({
        selectedContainers: [],
        stderr: true,
        stdout: true,
      });
    }
  }, []);

  useEffect(() => {
    if (filterCriteria === null || filterCriteria === undefined) {
      return;
    }
    localStorage.setItem(
      Constants.FILTER_CRITERIA_LOCAL_STORAGE_KEY,
      JSON.stringify(filterCriteria)
    );
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
