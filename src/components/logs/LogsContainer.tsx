import { useContext, useEffect, useRef, useState } from "react";
import { FilterCriteriaContext } from "../../App";
import { Log } from "../../interfaces/log";
import { LogService } from "../../services/logService";
import { ExecProcess } from "@docker/extension-api-client-types/dist/v1";

export function LogsContainer() {
  //Contexts
  const { filterCriteria } = useContext(FilterCriteriaContext);

  const [logs, setLogs] = useState<Log[]>([]);
  const logsRef = useRef<Log[]>([]);
  logsRef.current = logs;

  useEffect(() => {
    var listeners: ExecProcess[];
    console.log("setting listener");
    listeners = LogService.setLogListeners(filterCriteria, logsRef, setLogs);

    return () => {
      listeners.forEach((listener) => {
        listener.close();
      });
      console.log("clearing listeners");
      // setLogs([])
      // logsRef.current = [];
    };
  }, [filterCriteria]);

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
