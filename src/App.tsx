import { createDockerDesktopClient } from "@docker/extension-api-client";
import Divider from "@mui/material/Divider";
import "./styles.css";
import { Filter } from "./components/Filter";
import { useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>();

  useEffect(() => {
    console.log('Filter Criteria: ', filterCriteria);
  }, [filterCriteria])

  return (
    <>
      <div className="flex">
        <h1>Logs Watch</h1>
        <div className="spacer"></div>
        <Filter ddClient={useDockerDesktopClient()} setFilterCriteria={setFilterCriteria}></Filter>
      </div>
      <Divider />
    </>
  );
}
