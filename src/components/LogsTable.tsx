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
import { Log } from "../interfaces/log";
import { useState } from "react";
import { LogDetails } from "./LogDetails";

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
              <TableCell sx={{ width: "12rem" }}>Timestamp</TableCell>
              <TableCell align="left">Container</TableCell>
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
                  {log.timestamp.toLocaleString()}
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
