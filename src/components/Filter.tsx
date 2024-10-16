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

export function Filter() {
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
        {logSourceList()}
        {containerList(containers)}
      </Stack>
    </>
  );
}

function containerList(containers: Container[]) {
  return (
    <>
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
                  <>
                    <ListItem key={container.Id}>
                      <ListItemButton
                      // onClick={() => handleOnCheck(container.Id)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            // checked={
                            //   selectedContainers.indexOf(container.Id) !== -1
                            // }
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": container.Id }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={container.Id}
                          primary={`${container.Names[0].replace(/^\//, "")}`}
                          secondary={`${container.Image}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  </>
                );
              })}
            </List>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

function logSourceList() {
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="subtitle1">Source</Typography>
          <FormControlLabel
            control={
              <Checkbox
                // onClick={() =>
                //   setFilterCriteria({
                //     ...filterCriteria,
                //     stdout: !filterCriteria.stdout,
                //   })
                // }
                edge="start"
                // checked={filterCriteria.stdout}
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
                // onClick={() =>
                //   setFilterCriteria({
                //     ...filterCriteria,
                //     stderr: !filterCriteria.stderr,
                //   })
                // }
                edge="start"
                // checked={filterCriteria.stderr}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": "stderr" }}
              />
            }
            label="stderr"
          />
        </CardContent>
      </Card>
    </>
  );
}
