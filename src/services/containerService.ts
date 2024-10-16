import { Container } from "../interfaces/container";
import { DdClientProvider } from "./ddClientProvider";

export class ContainerService {
  public static async getContainers(): Promise<Container[]> {
    const ddClient = DdClientProvider.getClient();

    const containers = (await ddClient.docker.listContainers()) as Container[];

    return containers;
  }
}
