import { DockerDesktopClient } from "@docker/extension-api-client-types/dist/v1";
import { BorderAllOutlined, FilterList } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { Container } from "../interfaces/container";
import { DockerContainers } from "./DockerContainers";
import { FilterCriteria } from "../interfaces/filterCriteria";

const modalStyle = {
  width: 600,
  padding: "1rem",
  bgcolor: "background.default",
  borderRadius: 1,
  border: "solid",
  borderColor: "secondary.main",
  maxHeight: "80vh",
};

type prop = {
  ddClient: DockerDesktopClient;
  setFilterCriteria: (filterCriteria: FilterCriteria) => void;
  filterCriteria: FilterCriteria;
};

export function Filter({ ddClient, setFilterCriteria, filterCriteria }: prop) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainerIds, setselectedContainerIds] = useState<string[]>(
    []
  );

  let isFirstRender: boolean = true;

  const refreshContainerList = () => {
    ddClient.docker.listContainers().then((containers) => {
      const fetchedContainers = containers as Container[];
      setContainers(fetchedContainers);
      if (isFirstRender) {
        console.log("setting selectedContainerIds");
        setselectedContainerIds(
          filterCriteria.selectedContainers.map((c) => c.Id)
        );
        isFirstRender = false;
      }

      console.log("refreshed container list");
    });
  };

  useEffect(() => {
    setInterval(() => {
      refreshContainerList();
    }, 1000);
  }, []);

  useEffect(() => {
    const selectedContainers = containers.filter((c) =>
      selectedContainerIds.includes(c.Id)
    );
    const filterCriteriaUpdate = {
      ...filterCriteria,
      selectedContainers: selectedContainers,
    };
    console.log("Filter useEffect selectedContainerIds - ", {
      filterCriteriaUpdate,
      selectedContainerIds,
    });
    setFilterCriteria(filterCriteriaUpdate);
  }, [selectedContainerIds]);

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="filter">
        <FilterList />
      </IconButton>

      <Modal
        sx={{ position: "fixed", zIndex: 9999 }}
        className="flex flex-center"
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalStyle}>
          <Typography sx={{ marginBottom: "2rem" }} variant="h2">
            Filter
          </Typography>

          <Stack spacing={3}>
            {/* <Card> */}
              <CardContent>
                {LogSourceList(filterCriteria, setFilterCriteria)}
              </CardContent>
            {/* </Card> */}
            {/* <Card> */}
              <CardContent>
                <DockerContainers
                  containers={containers}
                  setselectedContainers={setselectedContainerIds}
                  selectedContainers={selectedContainerIds}
                ></DockerContainers>
              </CardContent>
            {/* </Card> */}
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

function LogSourceList(
  filterCriteria: FilterCriteria,
  setFilterCriteria: (filterCriteria: FilterCriteria) => void
) {
  return (
    <>
      <Typography variant="subtitle1">Source</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  onClick={() =>
                    setFilterCriteria({
                      ...filterCriteria,
                      stdout: !filterCriteria.stdout,
                    })
                  }
                  edge="start"
                  checked={filterCriteria.stdout}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": "stdout" }}
                />
              }
              label="stdout"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onClick={() =>
                    setFilterCriteria({
                      ...filterCriteria,
                      stderr: !filterCriteria.stderr,
                    })
                  }
                  edge="start"
                  checked={filterCriteria.stderr}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": "stderr" }}
                />
              }
              label="stderr"
            />
    </>
  );
}
