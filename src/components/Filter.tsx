import { useEffect, useState } from "react";
import { Container } from "../interfaces/container";
import { ContainerService } from "../services/containerService";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import {
  useFilterCriteriaContext,
  useFilterCriteriaUpdateContext,
} from "../contexts/filterCriteriaContext";
import { FilterCriteria } from "../interfaces/filterCriteria";

export function Filter() {
  //Contexts
  const filterCriteria = useFilterCriteriaContext();
  const updateContext = useFilterCriteriaUpdateContext();

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
        {logSourceList(filterCriteria, updateContext)}
        {containerList(containers, filterCriteria, updateContext)}
      </Stack>
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
    filterCriteria.stdout = !filterCriteria.stdout;
    setSelectedlogStreams({
      ...selectedlogStreams,
      stdout: filterCriteria.stdout,
    });
    filterCriteriaUpdate(filterCriteria);
  };

  const handleStderrClick = () => {
    filterCriteria.stderr = !filterCriteria.stderr;
    setSelectedlogStreams({
      ...selectedlogStreams,
      stderr: filterCriteria.stderr,
    });
    filterCriteriaUpdate(filterCriteria);
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
    console.log("existIndex", existIndex);
    if (existIndex !== -1) {
      selectedContainers = selectedContainers.filter(
        (sc) => sc.Id !== container.Id
      );
      filterCriteria.selectedContainers = selectedContainers;
    } else {
      selectedContainers.push(container);
      filterCriteria.selectedContainers = selectedContainers;
    }
    filterCriteriaUpdate(filterCriteria);
    setSelectedContainerIds(selectedContainers.map((c) => c.Id));
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
                          <div>State: {container.State}</div>
                          <div>Image: {container.Image}</div>
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
