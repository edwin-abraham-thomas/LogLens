import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Log } from "../interfaces/Log";

type prop = {
  logs: Log[];
};

export function LogsTable({ logs }: prop) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "17rem" }}>TimeStamp</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow>
                
              <TableCell component="th" scope="row">
                {log.timestamp.toUTCString()}
              </TableCell>
              <TableCell>{log.log}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
