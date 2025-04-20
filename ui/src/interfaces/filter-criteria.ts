import { Container } from "./container";

export interface FilterCriteria {
  selectedContainers: Container[];
  filterToLastNMinutes: number;
  stdout: boolean;
  stderr: boolean;
  page: number;
  pageSize: number;
}
