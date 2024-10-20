import "./styles.css";
import { Box, Divider, IconButton, Modal, Typography } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";
import { Filter } from "./components/Filter";
import { FilterList } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LogsContainer } from "./components/logs/LogsContainer";
import { Constants } from "./constants";

// Context setup
const filterCriteriaInitialState: FilterCriteria = {
  selectedContainers: [],
  stdout: true,
  stderr: true,
};
type FCContextType = {
  filterCriteria: FilterCriteria;
  setFilterCriteria: (filterCriteria: FilterCriteria) => void;
  refreshEvent: boolean;
};
export const FilterCriteriaContext = createContext<FCContextType>({
  filterCriteria: filterCriteriaInitialState,
  setFilterCriteria: () => {},
  refreshEvent: false,
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
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const handleFilterModalClose = () => setFilterModalOpen(false);
  const handleFilterModalOpen = () => setFilterModalOpen(true);

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(
    filterCriteriaInitialState
  );
  const [refreshEvent, setRefreshEvent] = useState<boolean>(false);

  useEffect(() => {
    const presetFilterCriteriaString = localStorage.getItem(
      Constants.FILTER_CRITERIA_LOCAL_STORAGE_KEY
    );
    if (
      presetFilterCriteriaString !== null &&
      presetFilterCriteriaString !== "" &&
      presetFilterCriteriaString !== undefined
    ) {
      const presetFilter = JSON.parse(presetFilterCriteriaString);
      setFilterCriteria(presetFilter);
    } else {
      setFilterCriteria(filterCriteriaInitialState);
    }
  }, []);

  useEffect(() => {
    if (filterCriteria === null || filterCriteria === undefined || filterCriteria == filterCriteriaInitialState) {
      return;
    }
    localStorage.setItem(
      Constants.FILTER_CRITERIA_LOCAL_STORAGE_KEY,
      JSON.stringify(filterCriteria)
    );
  }, [filterCriteria]);

  return (
    <>
      <FilterCriteriaContext.Provider
        value={{ filterCriteria, setFilterCriteria, refreshEvent }}
      >
        <Box sx={{ height: "95vh", display: "flex", flexDirection: "column" }}>
          <div className="flex items-center">
            <Typography variant="h2">Log Lens</Typography>
            <div className="spacer"></div>
            <IconButton
              aria-label="filter"
              onClick={() => setRefreshEvent(!refreshEvent)}
            >
              <RefreshIcon />
            </IconButton>
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
