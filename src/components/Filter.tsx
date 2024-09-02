import { DockerDesktopClient } from "@docker/extension-api-client-types/dist/v1";
import { FilterList, Padding } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { Container } from "../interfaces/container";
import { Containers } from "./Containers";
import { FilterCriteria } from "../interfaces/filterCriteria";

const modalStyle = {
  width: 600,
  padding: "1rem",
  bgcolor: "background.paper",
};

type prop = {
  ddClient: DockerDesktopClient;
  setFilterCriteria: (filterCriteria: FilterCriteria) => void;
};

export function Filter({ ddClient, setFilterCriteria }: prop) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainers, setselectedContainers] = useState<string[]>([]);

  useEffect(() => {
    setInterval(() => {
      ddClient.docker.listContainers().then((fetchedContainers) => {
        setContainers(fetchedContainers as Container[]);
      });
    }, 1000);
  }, []);

  useEffect(() => {
    setFilterCriteria({
      selectedContainerIds: selectedContainers,
      stream: "stdout"
    });
  }, [selectedContainers]);

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="filter">
        <FilterList />
      </IconButton>

      <Modal className="flex flex-center" open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>Filter</h2>
          <Containers
            containers={containers}
            setselectedContainers={setselectedContainers}
            selectedContainers={selectedContainers}
          ></Containers>
        </Box>
      </Modal>
    </>
  );
}
