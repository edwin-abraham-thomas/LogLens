import { useContext, useEffect, useState } from "react";
import { FilterCriteriaContext } from "../../app";
import { Log } from "../../interfaces/log";
import { LogService } from "../../services/log-service";
import { LogsTable } from "./logs-table";
import { Backdrop, CircularProgress } from "@mui/material";

type prop = {
  searchText: string;
};

export function LogsContainer({ searchText }: prop) {
  //Contexts
  const { filterCriteria, refreshEvent } = useContext(FilterCriteriaContext);
  
  const [logs, setLogs] = useState<Log[]>([]);
  const [estimatedLogsCount, setEstimatedLogsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(async () => {
      const response = await LogService.getLogs(filterCriteria);
      if (response != null) {
        setLogs(response.logs);
        setEstimatedLogsCount(response.estimatedRowCount);
      } else {
        setLogs([]);
        setEstimatedLogsCount(0);
      }
      setLoading(false);
    });

    return () => {};
  }, [filterCriteria, refreshEvent]);

  return (
    <>
      <LogsTable
        logs={logs.filter((s) => s.log.toLowerCase().includes(searchText.toLowerCase()))}
        searchText={searchText}
        estimatedLogsCount={estimatedLogsCount}
      />

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
