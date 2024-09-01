import { useEffect, useState } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import { Container } from "./interfaces/container";
import { Containers } from "./components/Containers";
import IconButton from "@mui/material/IconButton";
import { FilterList } from "@mui/icons-material";
import Divider from "@mui/material/Divider";

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    const ddClient = useDockerDesktopClient();

    setInterval(() => {
      ddClient.docker.listContainers().then((fetchedContainers) => {
        setContainers(fetchedContainers as Container[]);
      });
    }, 1000);
  }, []);

  return (
    <>
      <div>
        <h1>Logs Watch</h1>
        <IconButton aria-label="filter">
          <FilterList />
        </IconButton>
        <Divider />
      </div>

      <Containers containers={containers}></Containers>
    </>
  );
}
