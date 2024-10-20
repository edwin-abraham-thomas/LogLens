import { useContext, useEffect, useRef, useState } from "react";
import { FilterCriteriaContext } from "../../App";
import { Log } from "../../interfaces/log";
import { LogService } from "../../services/logService";

export function LogsContainer() {
  //Contexts
  const { filterCriteria, refreshEvent } = useContext(FilterCriteriaContext);

  const [logs, setLogs] = useState<Log[]>([]);
  const logsRef = useRef<Log[]>([]);
  logsRef.current = logs;

  useEffect(() => {
    console.log("refreshing");
    LogService.getLogs(filterCriteria, logsRef, setLogs)

    return () => {
    };
  }, [filterCriteria, refreshEvent]);

  return (
    <>
      <pre>
        {filterCriteria.selectedContainers.map((c) => c.Names).join(" | ")}
      </pre>
      <pre>
        {logsRef.current.map((l) => (
          <>
            <p>{`${l.timestamp.toLocaleString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              fractionalSecondDigits: 3,
            })}  |  ${l.containerName}  |  ${l.log}`}</p>
          </>
        ))}
      </pre>
    </>
  );
}
