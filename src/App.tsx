import { createDockerDesktopClient } from "@docker/extension-api-client";
import Divider from "@mui/material/Divider";
import "./styles.css";
import { Filter } from "./components/Filter";
import { useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";
import { Logs } from "./components/Log";

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>();

  useEffect(() => {
  }, [filterCriteria]);

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
      <Logs ddClient={useDockerDesktopClient()} filterCriteria={filterCriteria} />
    </>
  );
}
