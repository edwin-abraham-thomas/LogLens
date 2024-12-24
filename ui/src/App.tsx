import "./styles.css";
import {
  Box,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filterCriteria";
import { Filter } from "./components/filter/Filter";
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
    minWidth: "16rem",
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

  const [searchText, setSearchText] = useState<string>("");

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
    if (
      filterCriteria === null ||
      filterCriteria === undefined ||
      filterCriteria == filterCriteriaInitialState
    ) {
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
        <Box sx={{ height: "97vh", display: "flex", flexDirection: "column" }}>
          <div className="flex items-center gap-1">
            <Typography variant="h2">Log Lens</Typography>
            <div className="spacer"></div>
            <TextField
              sx={{ width: "30rem" }}
              placeholder={"Search"}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton
              aria-label="filter"
              onClick={() => setRefreshEvent(!refreshEvent)}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              aria-label="filter"
              onClick={handleFilterModalOpen}
            >
              <FilterList />
            </IconButton>
          </div>
          <LogsContainer searchText={searchText} />
        </Box>

        <Modal
          sx={{
            position: "fixed",
            zIndex: 9999,
            paddingTop: "4rem",
            paddingRight: "3rem",
          }}
          className="flex flex-top-right"
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
