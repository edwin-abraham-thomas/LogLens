import { createDockerDesktopClient } from "@docker/extension-api-client";
import Divider from "@mui/material/Divider";
import "./styles.css";
import { Filter } from "./components/Filter";
import { useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";
import { LogsContainer } from "./components/LogsContainer";

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>();

  return (
    <>
      <div className="flex items-center">
        <h2 className="app-header">Logs Watch</h2>
        <div className="spacer"></div>
        <Filter
          ddClient={useDockerDesktopClient()}
          setFilterCriteria={setFilterCriteria}
        />
      </div>
      <Divider />
      <LogsContainer ddClient={useDockerDesktopClient()} filterCriteria={filterCriteria} />
    </>
  );
}
