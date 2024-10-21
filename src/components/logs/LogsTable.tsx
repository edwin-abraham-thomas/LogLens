import {
  Drawer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { LogDetails } from "./logDetails";
import { useState } from "react";
import { Log } from "../../interfaces/log";

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
  const toggleDrawer = (state: DrawerState) => () => {
    setDrawerOpen(state);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: "18rem" }}>Timestamp</TableCell>
              <TableCell sx={{ minWidth: "25rem" }} align="left">
                Container
              </TableCell>
              <TableCell align="left">Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow
                hover
                key={index}
                onClick={toggleDrawer({ open: true, log: log })}
              >
                <TableCell component="th" scope="row">
                  {log.timestamp.toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    fractionalSecondDigits: 3,
                  })}
                </TableCell>
                <TableCell align="left">{log.containerName}</TableCell>
                <TableCell align="left">{log.log}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {drawerState.log && (
        <Drawer
          open={drawerState.open}
          onClose={toggleDrawer({ open: false })}
          anchor="right"
        >
          <LogDetails log={drawerState.log}></LogDetails>
        </Drawer>
      )}
    </>
  );
}
