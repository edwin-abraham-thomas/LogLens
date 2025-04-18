import "./styles.css";
import {
  Box,
  IconButton,
  Modal,
  TextField,
  Typography,
  Switch,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { FilterCriteria } from "./interfaces/filter-criteria";
import { Filter } from "./components/filter/Filter";
import { FilterList } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LogsContainer } from "./components/logs/logs-container";
import { Constants } from "./constants";
import { AppState } from "./interfaces/app-state";

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
const appState = getInitialFC();
const startupFilterCriteria = appState.filterCriteria
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
    overflow: "auto",
  };
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const handleFilterModalClose = () => setFilterModalOpen(false);
  const handleFilterModalOpen = () => setFilterModalOpen(true);
  //#endregion

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(
    startupFilterCriteria
  );
  const [refreshEvent, setRefreshEvent] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(appState.autoRefresh);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(appState.autoRefreshInterval);

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
      Constants.APP_STATE_LOCAL_STORAGE_KEY,
      JSON.stringify({
        filterCriteria: filterCriteria,
        autoRefresh: autoRefresh,
        autoRefreshInterval: autoRefreshInterval,
      } satisfies AppState)
    );
  }, [filterCriteria, autoRefresh, autoRefreshInterval]);
  //#endregion

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        setRefreshEvent((prev) => !prev);
      }, autoRefreshInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, autoRefreshInterval]);

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
            <Tooltip title="Auto refresh">
              <Switch
                    checked={autoRefresh}
                    onChange={(_, checked) => setAutoRefresh(checked)}
                    color="primary"
                  />
            </Tooltip>
            <Tooltip title="Auto refresh interval" placement="left">
              <Select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                size="small"
                // sx={{ width: 100, ml: 1 }}
                disabled={!autoRefresh}
              >
                <MenuItem value={2000}>2s</MenuItem>
                <MenuItem value={5000}>5s</MenuItem>
                <MenuItem value={10000}>10s</MenuItem>
                <MenuItem value={30000}>30s</MenuItem>
                <MenuItem value={60000}>60s</MenuItem>
              </Select>
            </Tooltip>
            <Tooltip title="Refresh logs">
              <IconButton
                aria-label="filter"
                onClick={() => setRefreshEvent(!refreshEvent)}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter">
              <IconButton aria-label="filter" onClick={handleFilterModalOpen}>
                <FilterList />
              </IconButton>
            </Tooltip>
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

function getInitialFC(): AppState {
  const presetAppStateString = localStorage.getItem(
    Constants.APP_STATE_LOCAL_STORAGE_KEY
  );

  if (
    presetAppStateString === null ||
    presetAppStateString === "" ||
    presetAppStateString === undefined
  ) {
    return {
      filterCriteria: defaultFilterCriteria,
      autoRefresh: false,
      autoRefreshInterval: 5000,
    };
  } else {
    const presetFilter = JSON.parse(presetAppStateString);
    return presetFilter;
  }
}
