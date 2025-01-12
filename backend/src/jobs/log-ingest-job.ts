import Dockerode, { ContainerInfo } from "dockerode";
import { processLogChunks } from "./process-log-chunks";
import { LogsRepository } from "../data-access/database";
import { Docker } from "../dependencies/docker";

export class LogInjestJob {
  private readonly _dockerClient: Dockerode;
  private readonly _logsRepo: LogsRepository;
  private readonly _containerExclutionList: string[];

  constructor() {
    this._dockerClient = Docker.getDockerClient();
    this._logsRepo = new LogsRepository();
    this._containerExclutionList = ["/loglensbackend", "/loglensdb"];
  }

  public async start(): Promise<void> {
    console.log("Starting log ingest job");

    const containers = await this._dockerClient.listContainers({ all: true });
    containers
      .filter(
        (containerInfo: any) =>
          !this._containerExclutionList.includes(containerInfo.Names[0])
      )
      .forEach(async (containerInfo: ContainerInfo) => {
        console.log(
          `Found container ${containerInfo.Names[0]}. Looking for logs`
        );
        await this.saveContainerLogs(containerInfo.Id, containerInfo);
      });

    this._dockerClient.getEvents().then((stream) => {
      stream.on("data", async (chunk: Buffer) => {
        const event = JSON.parse(chunk.toString());

        if (event.Type !== "container") {
          return;
        }
        const containerStartEvents: string[] = ["start"];
        if (
          event.Type === "container" &&
          containerStartEvents.includes(event.Action)
        ) {
          console.log(
            `Container: ${event.Actor.Attributes.name} start event. ID: ${event.id}. Action: ${event.Action}. Saving logs`
          );
          const filter = {
            filters: {
              id: [event.id],
            },
          };
          const container = await this._dockerClient.listContainers(filter);
          await this.saveContainerLogs(event.id, container[0]);
        }

        const containerStopEvents: string[] = ["destroy"];
        if (
          event.Type === "container" &&
          containerStopEvents.includes(event.Action)
        ) {
          console.log(
            `Container: ${event.Actor.Attributes.name} stop event. ID: ${event.id}. Action: ${event.Action}. Deleting logs`
          );

          await this.deleteContainerLogs(event.id);
        }
      });
    });
  }

  private async saveContainerLogs(
    containerId: string,
    containerInfo: ContainerInfo
  ) {
    this._dockerClient.getContainer(containerId).logs(
      {
        follow: true,
        details: false,
        timestamps: true,
        stdout: true,
        stderr: true,
      },
      (err: any, stream: any) => {
        if (err) {
          console.error("Error getting logs for container", containerId);
          return;
        }

        stream.on("data", async (chunk: Buffer) => {
          console.log(
            `Processing logs from container: ${containerInfo.Names[0]}`
          );
          const logs = processLogChunks(chunk);
          console.log(
            `Found ${logs?.length} logs from container: ${containerInfo.Names[0]}`
          );
          const containerName = containerInfo.Names[0].replace(/^\//, "");
          logs.forEach((log) => {
            log.containerId = containerId;
            log.containerName = containerName;
          });
          await this._logsRepo.insertLogs(logs);
        });
      }
    );
  }

  private async deleteContainerLogs(containerId: string): Promise<void> {
    await this._logsRepo.deleteLogs(containerId);
  }
}
