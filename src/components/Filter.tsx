import { useContext, useEffect, useState } from "react";
import { Container } from "../interfaces/container";
import { ContainerService } from "../services/containerService";
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { FilterCriteriaContext } from "../App";

var loading: boolean = false;

export function Filter() {
  //Contexts
  const { filterCriteria, setFilterCriteria } = useContext(
    FilterCriteriaContext
  );

  const [containers, setContainers] = useState<Container[]>([]);
  const setContainersList = () => {
    ContainerService.getContainers().then((fetchedContainers: Container[]) => {
      setContainers(fetchedContainers);
    });
  };

  useEffect(() => {
    setContainersList();
    setInterval(() => {
      setContainersList();
    }, 1000);
  }, []);

  return (
    <>
      <Typography sx={{ marginBottom: "2rem" }} variant="h2">
        Filter
      </Typography>

      <Stack spacing={3}>
        {logSourceList(filterCriteria, setFilterCriteria)}
        {containerList(containers, filterCriteria, setFilterCriteria)}
      </Stack>

      {/* <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </>
  );
}

function logSourceList(
  filterCriteria: FilterCriteria,
  filterCriteriaUpdate: (filterCriteria: FilterCriteria) => void
) {
  const [selectedlogStreams, setSelectedlogStreams] = useState<{
    stdout: boolean;
    stderr: boolean;
  }>({
    stdout: filterCriteria.stdout,
    stderr: filterCriteria.stderr,
  });

  const handleStdoutClick = () => {
    setSelectedlogStreams({
      ...selectedlogStreams,
      stdout: !filterCriteria.stdout,
    });
    const fcUpdate = { ...filterCriteria, stdout: !filterCriteria.stdout };
    filterCriteriaUpdate(fcUpdate);
  };

  const handleStderrClick = () => {
    setSelectedlogStreams({
      ...selectedlogStreams,
      stderr: !filterCriteria.stderr,
    });
    const fcUpdate = { ...filterCriteria, stderr: !filterCriteria.stderr };
    filterCriteriaUpdate(fcUpdate);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1">Source</Typography>
        <FormControlLabel
          control={
            <Checkbox
              onClick={() => handleStdoutClick()}
              edge="start"
              checked={selectedlogStreams.stdout}
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
              onClick={() => handleStderrClick()}
              edge="start"
              checked={selectedlogStreams.stderr}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": "stderr" }}
            />
          }
          label="stderr"
        />
      </CardContent>
    </Card>
  );
}

function containerList(
  containers: Container[],
  filterCriteria: FilterCriteria,
  filterCriteriaUpdate: (filterCriteria: FilterCriteria) => void
) {
  const [selectedContainerIds, setSelectedContainerIds] = useState<string[]>(
    filterCriteria.selectedContainers.map((c) => c.Id)
  );

  const handleContainerSelection = (container: Container) => {
    var selectedContainers = filterCriteria.selectedContainers;
    const existIndex = selectedContainers.findIndex(
      (c) => c.Id == container.Id
    );

    var fcUpdate: FilterCriteria;
    if (existIndex !== -1) {
      selectedContainers = selectedContainers.filter(
        (sc) => sc.Id !== container.Id
      );
      fcUpdate = { ...filterCriteria, selectedContainers };
    } else {
      selectedContainers.push(container);
      fcUpdate = { ...filterCriteria, selectedContainers };
    }
    filterCriteriaUpdate(fcUpdate);
    setSelectedContainerIds(selectedContainers.map((c) => c.Id));
    startLoading(10);
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" sx={{ marginBottom: "1rem" }}>
          Containers
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxHeight: "50vh",
            bgcolor: "primary.dark",
            overflow: "auto",
          }}
        >
          <List sx={{ bgcolor: "background.paper" }} dense>
            {containers.map((container) => {
              return (
                <ListItem key={container.Id}>
                  <ListItemButton
                    onClick={() => handleContainerSelection(container)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={
                          selectedContainerIds.indexOf(container.Id) !== -1
                        }
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": container.Id }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={container.Id}
                      primary={`${container.Names[0].replace(/^\//, "")}`}
                      secondary={
                        <>
                          <span>State: {container.State}</span>
                          <br />
                          <span>Image: {container.Image}</span>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
}

function startLoading(timeout: number = 50) {
  loading = true;

  setTimeout(() => (loading = false), timeout);
}
