import { useContext, useEffect, useState } from "react";
import { Container } from "../../interfaces/container";
import { ContainerService } from "../../services/containerService";
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { FilterCriteria } from "../../interfaces/filterCriteria";
import { FilterCriteriaContext } from "../../App";
import { ContainerStatusIcon } from "../icons/ContainerStatusIcon";

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
        {containerList(containers, filterCriteria, setFilterCriteria)}
        {logSourceList(filterCriteria, setFilterCriteria)}
      </Stack>
    </>
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
    let selectedContainers = filterCriteria.selectedContainers;
    const existIndex = selectedContainers.findIndex(
      (c) => c.Id == container.Id
    );

    let fcUpdate: FilterCriteria;
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
        <CardContent
          sx={{
            overflow: "auto",
            maxHeight: "35rem",
          }}
        >
          <Typography variant="subtitle1" sx={{ marginBottom: "1rem" }}>
            Containers
          </Typography>
          <div className="flex flex-column">
            {containers.map((c) => {
              return (
                <FormControlLabel
                  key={c.Id}
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
                  label={
                    <>
                      <div className="flex gap-1">
                        <ContainerStatusIcon rotate={c.State == "running"} />
                        <Typography variant="body1">
                          {c.Names[0].replace(/^\//, "")}
                        </Typography>
                        <Typography
                          sx={{ color: "text.secondary" }}
                          variant="body1"
                        >
                          {c.Image}
                        </Typography>
                      </div>
                    </>
                  }
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
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
