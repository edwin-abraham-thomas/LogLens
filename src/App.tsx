import { createDockerDesktopClient } from "@docker/extension-api-client";
import "./styles.css";
import { Box, Divider, Typography } from "@mui/material";

const client = createDockerDesktopClient();
function useDockerDesktopClient() {
  return client;
}

export function App() {


  return (
    <Box sx={{ height: "95vh", display: "flex", flexDirection: "column" }}>
      <div className="flex items-center">
        <Typography variant="h2">Log Lens</Typography>
      </div>
      
      <Divider />
    </Box>
  );
}
