import { useContext } from "react";
import { FilterCriteriaContext } from "../../App";

export function LogsContainer() {
  //Contexts
  const { filterCriteria, setFilterCriteria } = useContext(
    FilterCriteriaContext
  );

  console.log("rerender LogsContainer");

  return (
    <>
      <pre>{JSON.stringify(filterCriteria, null, 2)}</pre>
    </>
  );
}
