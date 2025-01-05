import { Container } from "../interfaces/container";
import { DdClientProvider } from "./dd-client-provider";

export class ContainerService {
  public static async getContainers(): Promise<Container[]> {
    const ddClient = DdClientProvider.getClient();

    const containers = (await ddClient.docker.listContainers({
      all: true,
    })) as Container[];

    return containers;
  }
}
