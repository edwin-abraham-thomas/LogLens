import { createContext, useContext, useState } from "react";
import { FilterCriteria } from "../interfaces/filterCriteria";

const filterCriteriaInitialState: FilterCriteria = {
  selectedContainers: [],
  stdout: true,
  stderr: true,
};

const FilterCriteriaContext = createContext<FilterCriteria>(
  filterCriteriaInitialState
);

const FilterCriteriaUpdateContext = createContext<
  (filterCriteria: FilterCriteria) => void
>((filterCriteria) => {
});

export function useFilterCriteriaContext() {
  return useContext(FilterCriteriaContext);
}

export function useFilterCriteriaUpdateContext() {
  return useContext(FilterCriteriaUpdateContext);
}

export function FilterCriteriaProvider({ children }: any) {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(
    filterCriteriaInitialState
  );

  return (
    <FilterCriteriaContext.Provider value={filterCriteria}>
      <FilterCriteriaUpdateContext.Provider value={setFilterCriteria}>
        {children}
      </FilterCriteriaUpdateContext.Provider>
    </FilterCriteriaContext.Provider>
  );
}
