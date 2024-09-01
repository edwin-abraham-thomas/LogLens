import List from "@mui/material/List";
import { Container } from "../interfaces/container";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import { SyntheticEvent, useState } from "react";
import IconButton from "@mui/material/IconButton";

type Props = {
  containers: Container[];
};

export function Containers({ containers }: Props) {
  const [selectedContainers, setselectedContainers] = useState<string[]>([]);

  const handleOnCheck = (containerId: string) => {
    const currentIndex = selectedContainers.indexOf(containerId);
    const newSelectedContainers = [...selectedContainers];

    if (currentIndex === -1) {
      newSelectedContainers.push(containerId);
    } else {
      setselectedContainers(newSelectedContainers.splice(currentIndex, 1));
    }

    setselectedContainers(newSelectedContainers);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 1,
          bgcolor: "primary.dark",
        }}
      >
        <List sx={{ bgcolor: "background.paper" }} dense>
          {containers.map((container) => {
            return (
              <ListItem key={container.Id}>
                <ListItemButton onClick={() => handleOnCheck(container.Id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedContainers.indexOf(container.Id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": container.Id }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={container.Id}
                    primary={`${container.Names[0]}`}
                    secondary={`${container.Image}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </>
  );
}
