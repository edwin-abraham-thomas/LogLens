import "./styles.css";
import { Box, Divider, IconButton, Modal, Typography } from "@mui/material";
import { createContext, useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";
import { Filter } from "./components/Filter";
import { FilterList } from "@mui/icons-material";
import { LogsContainer } from "./components/logs/LogsContainer";

// Context setup
const filterCriteriaInitialState: FilterCriteria = {
  selectedContainers: [],
  stdout: true,
  stderr: true,
};
type FCContextType = {
  filterCriteria: FilterCriteria;
  setFilterCriteria: (filterCriteria: FilterCriteria) => void;
};
export const FilterCriteriaContext = createContext<FCContextType>({
  filterCriteria: filterCriteriaInitialState,
  setFilterCriteria: () => {},
});

export function App() {
  //Filter modal settings
  const filterModalStyle = {
    width: 600,
    padding: "1rem",
    bgcolor: "background.default",
    borderRadius: 1,
    border: "solid",
    borderColor: "secondary.main",
    maxHeight: "80vh",
  };
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(true);
  const handleFilterModalClose = () => setFilterModalOpen(false);
  const handleFilterModalOpen = () => setFilterModalOpen(true);

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(
    filterCriteriaInitialState
  );

  return (
    <>
      <FilterCriteriaContext.Provider
        value={{ filterCriteria, setFilterCriteria }}
      >
        <Box sx={{ height: "95vh", display: "flex", flexDirection: "column" }}>
          <div className="flex items-center">
            <Typography variant="h2">Log Lens</Typography>
            <div className="spacer"></div>
            <IconButton aria-label="filter" onClick={handleFilterModalOpen}>
              <FilterList />
            </IconButton>
          </div>
          <Divider />
          <LogsContainer />
        </Box>

        <Modal
          sx={{ position: "fixed", zIndex: 9999 }}
          className="flex flex-center"
          open={filterModalOpen}
          onClose={handleFilterModalClose}
        >
          <Box sx={filterModalStyle}>
            <Filter />
          </Box>
        </Modal>
      </FilterCriteriaContext.Provider>
    </>
  );
}
