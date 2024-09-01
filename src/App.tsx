import React, { useEffect, useState } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import { Container } from "./interfaces/container";
import { Containers } from "./components/Containers";

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
      <h2>LogsWatch</h2>
      <Containers containers={containers}></Containers>
    </>
  );
}
