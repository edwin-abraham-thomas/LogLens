import Dockerode, { ContainerInfo } from "dockerode";
import { logsCollectionName } from "../constants";
import { processLogChunks } from "./process-log-chunks";
import { Db } from "mongodb";

export class LogInjestJob {
  private readonly _db: Db;
  private readonly _dockerClient: Dockerode;

  constructor(db: Db, dockerClient: Dockerode) {
    this._db = db;
    this._dockerClient = dockerClient;
  }

  public async start(): Promise<void> {
    console.log("Starting log ingest job");

    const containers = await this._dockerClient.listContainers();
    containers
      .filter(
        (containerInfo: ContainerInfo) =>
          !["/loglensbackend", "/loglensdb"].includes(containerInfo.Names[0])
      )
      .forEach(async (containerInfo: ContainerInfo) => {
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
            `Container: ${event.Actor.Attributes.name} start event. ID: ${event.id}. Action: ${event.Action}`
          );
          const container = await this._dockerClient.listContainers({filters: {
            id : event.id
          }})
          await this.saveContainerLogs(event.id, container[0]);
        }

        const containerStopEvents: string[] = ["kill"];
        if (
          event.Type === "container" &&
          containerStopEvents.includes(event.Action)
        ) {
          console.log(
            `Container: ${event.Actor.Attributes.name} stop event. ID: ${event.id}. Action: ${event.Action}`
          );

          await this.deleteContainerLogs(event.id);
        }
      });
    });
  }

  private async saveContainerLogs(containerId: string, containerInfo: ContainerInfo) {
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
          const logs = processLogChunks(chunk);
          logs.forEach((log) => {
            log.containerId = containerId;
            log.containerName = containerInfo.Names[0].replace(/^\//, "")
          });

          await this._db.collection(logsCollectionName).insertMany(logs);
        });
      }
    );
  }

  private async deleteContainerLogs(containerId: string): Promise<void> {
    const filter = { containerId: containerId };
    await this._db.collection(logsCollectionName).deleteMany(filter);
  }
}
