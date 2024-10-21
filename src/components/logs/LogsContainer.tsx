import { useContext, useEffect, useState } from "react";
import { FilterCriteriaContext } from "../../App";
import { Log } from "../../interfaces/log";
import { LogService } from "../../services/logService";
import { LogsTable } from "./LogsTable";
import { Backdrop, CircularProgress } from "@mui/material";

type prop = {
  searchText: string;
};

export function LogsContainer({ searchText }: prop) {
  //Contexts
  const { filterCriteria, refreshEvent } = useContext(FilterCriteriaContext);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      LogService.getLogs(filterCriteria, setLogs);
      setLoading(false);
    });

    return () => {};
  }, [filterCriteria, refreshEvent]);

  return (
    <>
      {/* <pre>
        {filterCriteria.selectedContainers.map((c) => c.Names).join("  ")}
      </pre> */}

      <LogsTable logs={logs.filter((s) => s.log.includes(searchText))} />

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
