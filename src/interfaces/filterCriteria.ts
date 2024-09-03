import { Container } from "./container";

export interface FilterCriteria {
  selectedContainers: Container[];
  stream: 'stdout' | 'stderr';
}
