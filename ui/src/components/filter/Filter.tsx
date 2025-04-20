import { useContext, useEffect, useState } from "react";
import { Container } from "../../interfaces/container";
import { ContainerService } from "../../services/container-service";
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { FilterCriteria } from "../../interfaces/filter-criteria";
import { FilterCriteriaContext } from "../../App";
import { ContainerStatusIcon } from "../icons/container-status-icon";

export function Filter() {
  //Contexts
  const { filterCriteria, setFilterCriteria } = useContext(
    FilterCriteriaContext
  );

  const [containers, setContainers] = useState<Container[]>([]);
  const setContainersList = (syncFC: boolean = false) => {
    ContainerService.getContainers().then((fetchedContainers: Container[]) => {
      setContainers(
        fetchedContainers.filter(
          (container) =>
            !["/loglensbackend", "/loglensdb"].includes(container.Names[0])
        )
      );

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
        {additionalFilters(filterCriteria, setFilterCriteria)}
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

function additionalFilters(
  filterCriteria: FilterCriteria,
  filterCriteriaUpdate: (filterCriteria: FilterCriteria) => void
) {
  const [filterToLastNMinutes, setFilterToLastNMinutes] = useState<number>(
    filterCriteria.filterToLastNMinutes
  );

  const handleLastNMinuteSelect = (filterMinutes: Number) => {
    setFilterToLastNMinutes(filterMinutes.valueOf());
    const fcUpdate = {
      ...filterCriteria,
      filterToLastNMinutes: filterMinutes.valueOf(),
    };
    filterCriteriaUpdate(fcUpdate);
  };

  return (
    <>
      <Select
        value={filterToLastNMinutes}
        onChange={(e) => handleLastNMinuteSelect(Number(e.target.value))}
        size="small"
      >
        <MenuItem value={15}>Last 15 minutes</MenuItem>
        <MenuItem value={60}>Last 1 hour</MenuItem>
        <MenuItem value={240}>Last 4 hours</MenuItem>
        <MenuItem value={1440}>Last 1 Day</MenuItem>
        <MenuItem value={2880}>Last 2 Days</MenuItem>
        <MenuItem value={2880}>Last 3 Days</MenuItem>
        <MenuItem value={10080}>Last 7 Days</MenuItem>
        <MenuItem value={-1}>All</MenuItem>
      </Select>
    </>
  );
}
