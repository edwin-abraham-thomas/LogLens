import { useContext, useEffect, useState } from "react";
import { Container } from "../interfaces/container";
import { ContainerService } from "../services/containerService";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { FilterCriteria } from "../interfaces/filterCriteria";
import { FilterCriteriaContext } from "../App";

export function Filter() {
  //Contexts
  const { filterCriteria, setFilterCriteria } = useContext(
    FilterCriteriaContext
  );

  const [containers, setContainers] = useState<Container[]>([]);
  const setContainersList = (syncFC: boolean = false) => {
    ContainerService.getContainers().then((fetchedContainers: Container[]) => {
      setContainers(fetchedContainers);

      if (syncFC) {
        const nonExistantContainers: Container[] = [];

        filterCriteria.selectedContainers?.map((sc) => {
          if (fetchedContainers.findIndex((fc) => fc.Id === sc.Id) === -1) {
            nonExistantContainers.push(sc);
          }
        });
        const fcSelectedContainersUpdate =
          filterCriteria.selectedContainers.filter(
            (sc) =>
              nonExistantContainers.findIndex((nec) => nec.Id === sc.Id) === -1
          );
        const fcUpdate = {
          ...filterCriteria,
          selectedContainers: fcSelectedContainersUpdate,
        };
        console.log(
          "filterCriteria: ",
          filterCriteria,
          " fcUpdate: ",
          fcUpdate,
          " nonExistantContainers: ",
          nonExistantContainers
        );
        setFilterCriteria(fcUpdate);
      }
    });
  };

  useEffect(() => {
    setContainersList(true);
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
  };
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ marginBottom: "1rem" }}>
            Containers
          </Typography>
          <div className="flex flex-column">
            {containers.map((c) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={() => handleContainerSelection(c)}
                      checked={selectedContainerIds.indexOf(c.Id) !== -1}
                      edge="start"
                      tabIndex={-1}
                      inputProps={{
                        "aria-labelledby": c.Names[0].replace(/^\//, ""),
                      }}
                    />
                  }
                  label={c.Names[0].replace(/^\//, "")}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
