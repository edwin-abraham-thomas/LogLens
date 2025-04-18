import { FilterCriteria } from "./filter-criteria";

export interface AppState {
    filterCriteria: FilterCriteria,
    autoRefresh: boolean,
    autoRefreshInterval: number
}