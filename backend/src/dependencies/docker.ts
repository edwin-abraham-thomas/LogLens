import Dockerode from "dockerode";
import { dockerSocketFile } from "../constants";

export class Docker {
  private static _dockerClient: Dockerode;

  public static getDockerClient(): Dockerode {
    if (!Docker._dockerClient) {
      Docker._dockerClient = new Dockerode({ socketPath: dockerSocketFile });
    }

    return Docker._dockerClient;
  }
}
