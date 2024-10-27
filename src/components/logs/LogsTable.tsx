import { Drawer } from "@mui/material";
import { LogDetails } from "./LogDetails";
import { useState } from "react";
import { Log } from "../../interfaces/log";
import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";

interface DrawerState {
  open: boolean;
  log?: Log;
}

type prop = {
  logs: Log[];
};

export function LogsTable({ logs }: prop) {
  const [drawerState, setDrawerOpen] = useState<DrawerState>({
    open: false,
  });

  const gridRef = useGridApiRef();
  const columns: GridColDef[] = [
    {
      field: "timestamp",
      headerName: "Timestamp",
      width: 215,
      filterable: false,
      sortable: false,
      valueGetter: (_, row) =>
        row.timestamp.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          fractionalSecondDigits: 3,
        }),
    },
    {
      field: "containerName",
      headerName: "Container",
      description: "Container from which log was emitted",
      flex: 0.3,
      sortable: false,
    },
    {
      field: "log",
      headerName: "Message",
      description: "Log content",
      flex: 1,
      sortable: false,
      filterable: false,
      resizable: false,
    },
  ];

  return (
    <>
      <div className="logs-table-dimension">
        <DataGrid
          apiRef={gridRef}
          density="compact"
          autosizeOnMount
          rowHeight={46}
          onCellClick={(params) => {
            setDrawerOpen({ open: true, log: params.row });
          }}
          getRowId={(log) => log.logId}
          rows={logs}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 50, page: 0 },
            },
          }}
          pageSizeOptions={[
            20,
            50,
            100,
            { value: -1, label: "All" },
          ]}
        />
      </div>

      {drawerState.log && (
        <Drawer
          open={drawerState.open}
          onClose={() => setDrawerOpen({ open: true })}
          anchor="right"
        >
          <LogDetails log={drawerState.log}></LogDetails>
        </Drawer>
      )}
    </>
  );
}
