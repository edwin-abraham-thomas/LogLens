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
  // const [logs, setLogs] = useState<Log[]>([]);
  // const logsRef = useRef<Log[]>([]);
  // logsRef.current = logs;

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

  // const filter: FilterCriteria = {
  //   selectedContainers: [
  //     {
  //       Id: "89f834d7bbf722c75a4100188572f8ad13a775f57ad446ad2f1a75fca164fc9f",
  //       Image: "temperatureservice",
  //       Names: ["temperatureservice-1"],
  //     },
  //     {
  //       Id: "44edfa5c1cc1cf14bc29a7fcfa892bd4848b4886c00b5d461ca22935946a2a8b",
  //       Image: "weathersummaryservice",
  //       Names: ["weathersummaryservice-1"],
  //     },
  //     {
  //       Id: "d227dd62870b5b3cc8c190d54b374d2b104a1ac5b328b1ea938edd98d8ad8f17",
  //       Image: "weatherforecast",
  //       Names: ["weatherforecast-1"],
  //     },
  //   ],
  //   stdout: true,
  //   stderr: true,
  // };

  // useEffect(() => {
  //   const listener = LogService.setLogListeners(filter, logsRef, setLogs);
  //   console.log("rerender useEffect");

  //   return () => {
  //     listener.forEach((listener) => {
  //       listener.close();
  //     });
  //     logsRef.current = [];
  //   };
  // }, []);

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
