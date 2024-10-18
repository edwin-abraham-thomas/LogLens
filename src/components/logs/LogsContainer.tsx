import { useFilterCriteriaContext } from "../../contexts/filterCriteriaContext";

export function LogsContainer() {
    //Contexts
    const filterCriteria = useFilterCriteriaContext();
    console.log("rerender LogsContainer")

    return(
        <>
            <pre>{JSON.stringify(filterCriteria, null, 4)}</pre>
        </>
    )
}