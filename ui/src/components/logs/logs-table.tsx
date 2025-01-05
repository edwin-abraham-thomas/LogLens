import { Drawer } from "@mui/material";
import { LogDetails } from "./log-details";
import { useContext, useState } from "react";
import { Log } from "../../interfaces/log";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  useGridApiRef,
} from "@mui/x-data-grid";
import { FilterCriteriaContext } from "../../app";
import { FilterCriteria } from "../../interfaces/filter-criteria";
import Highlighter from "react-highlight-words";

interface DrawerState {
  open: boolean;
  log?: Log;
}

type prop = {
  logs: Log[];
  estimatedLogsCount: number;
  searchText: string;
};

export function LogsTable({ logs, estimatedLogsCount, searchText }: prop) {
  //Contexts
  const { filterCriteria, setFilterCriteria } = useContext(
    FilterCriteriaContext
  );

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
      filterable: false,
    },
    {
      field: "log",
      headerName: "Message",
      description: "Log content",
      flex: 1,
      sortable: false,
      filterable: false,
      resizable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return (
          <div style={{overflow: "auto"}}>
            <Highlighter
              searchWords={[searchText]}
              textToHighlight={params.value as string}
              caseSensitive={false}
            />
          </div>
        );
      },
    },
  ];

  const onPaginationChange = (change: GridPaginationModel) => {
    const fcUpdate: FilterCriteria = {
      ...filterCriteria,
      page: change.page,
      pageSize: change.pageSize,
    };
    setFilterCriteria(fcUpdate);
  };

  return (
    <>
      <div className="logs-table-dimension">
        <DataGrid
          paginationMode="server"
          onPaginationModelChange={onPaginationChange}
          estimatedRowCount={estimatedLogsCount}
          apiRef={gridRef}
          density="compact"
          autosizeOnMount
          rowHeight={46}
          onCellClick={(params) => {
            setDrawerOpen({ open: true, log: params.row });
          }}
          getRowId={(log) => log._id}
          rows={logs}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: filterCriteria.pageSize,
                page: filterCriteria.page,
              },
              rowCount: -1,
            },
          }}
          pageSizeOptions={[20, 50, 100, { value: -1, label: "All" }]}
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
