import { DockerDesktopClient } from "@docker/extension-api-client-types/dist/v1";
import { FilterList, Padding } from "@mui/icons-material";
import { Box, Modal, Typography } from "@mui/material";
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
  const [selectedContainerIds, setselectedContainerIds] = useState<string[]>(
    []
  );

  useEffect(() => {

    ddClient.docker.listContainers().then((fetchedContainers) => {
      setContainers(fetchedContainers as Container[]);
    });
  }, []);

  useEffect(() => {
    const selectedContainers = containers.filter((c) =>
      selectedContainerIds.includes(c.Id)
    );
    setFilterCriteria({
      selectedContainers: selectedContainers,
      stream: "stdout",
    });
  }, [selectedContainerIds]);

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="filter">
        <FilterList />
      </IconButton>

      <Modal className="flex flex-center" open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h3">Filter</Typography>
          <Containers
            containers={containers}
            setselectedContainers={setselectedContainerIds}
            selectedContainers={selectedContainerIds}
          ></Containers>
        </Box>
      </Modal>
    </>
  );
}
