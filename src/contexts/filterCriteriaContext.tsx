import { createContext, useState } from "react";
import { FilterCriteria } from "../interfaces/filterCriteria";

const filterCriteriaInitialState: FilterCriteria = {
  selectedContainers: [],
  stdout: true,
  stderr: true,
};

const FilterCriteriaContext = createContext<FilterCriteria>(
  filterCriteriaInitialState
);

export function FilterCriteriaProvider({ children }: any) {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(
    filterCriteriaInitialState
  );

  return (
    <FilterCriteriaContext.Provider value={filterCriteria}>
      {children}
    </FilterCriteriaContext.Provider>
  );
}
