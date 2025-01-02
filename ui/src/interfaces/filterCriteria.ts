import { Container } from "./container";

export interface FilterCriteria {
  selectedContainers: Container[];
  stdout: boolean;
  stderr: boolean;
  page: number;
  pageSize: number;
}
