import "./styles.css";
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filter-criteria";
import { Filter } from "./components/filter/filter";
import { FilterList } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LogsContainer } from "./components/logs/logs-container";
import { Constants } from "./constants";

//#region Context setup
const defaultFilterCriteria: FilterCriteria = {
  selectedContainers: [],
  stdout: true,
  stderr: true,
  page: Constants.DEFAULT_PAGE,
  pageSize: Constants.DEFAULT_PAGE_SIZE,
};
type FCContextType = {
  filterCriteria: FilterCriteria;
  setFilterCriteria: (filterCriteria: FilterCriteria) => void;
  refreshEvent: boolean;
};
const startupFilterCriteria = getInitialFC();
export const FilterCriteriaContext = createContext<FCContextType>({
  filterCriteria: startupFilterCriteria,
  setFilterCriteria: () => {},
  refreshEvent: false,
});
//#endregion

export function App() {
  //#region Filter modal settings
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
  //#endregion

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(
    startupFilterCriteria
  );
  const [refreshEvent, setRefreshEvent] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");

  //#region Local storage management
  useEffect(() => {
    if (
      filterCriteria === null ||
      filterCriteria === undefined ||
      filterCriteria == defaultFilterCriteria
    ) {
      return;
    }
    localStorage.setItem(
      Constants.FILTER_CRITERIA_LOCAL_STORAGE_KEY,
      JSON.stringify(filterCriteria)
    );
  }, [filterCriteria]);
  //#endregion

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
            <IconButton aria-label="filter" onClick={handleFilterModalOpen}>
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

function getInitialFC(): FilterCriteria {
  const presetFilterCriteriaString = localStorage.getItem(
    Constants.FILTER_CRITERIA_LOCAL_STORAGE_KEY
  );
  if (
    presetFilterCriteriaString !== null &&
    presetFilterCriteriaString !== "" &&
    presetFilterCriteriaString !== undefined
  ) {
    const presetFilter = JSON.parse(presetFilterCriteriaString);
    return presetFilter;
  } else {
    return defaultFilterCriteria;
  }
}
