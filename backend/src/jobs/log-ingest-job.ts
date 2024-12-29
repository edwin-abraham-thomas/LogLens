import Dockerode, { Container } from "dockerode";
import { dockerSocketFile, logsCollectionName } from "../constants";
import { processLogChunks } from "./process-log-chunks";
import { Db } from "mongodb";

export async function startLogIngestJob(db: Db) {
  console.log("Starting log ingest job");
  var docker = new Dockerode({ socketPath: dockerSocketFile });

  const containers = await docker.listContainers();
  containers
    .filter(
      (containerInfo: any) =>
        !["/loglensbackend", "/loglensdb"].includes(containerInfo.Names[0])
    )
    .forEach((containerInfo: any) => {
      docker.getContainer(containerInfo.Id).logs(
        {
          follow: true,
          details: false,
          timestamps: true,
          stdout: true,
          stderr: true,
        },
        (err: any, stream: any) => {
          if (err) {
            console.error("Error getting logs for container", containerInfo.Id);
            return;
          }

          stream.on("data", async (chunk: Buffer) => {
            const logs = processLogChunks(chunk);

            logs.forEach((l) => {
              const t = l.timestamp;
              const timestampString: string = t.toISOString();

              console.log(
                `${timestampString} ---- ${l.orderingKey} ---- ${l.streamType} ---- ${l.log}`
              );
            });
            await db.collection(logsCollectionName).insertMany(logs);
          });
        }
      );
    });

  docker.getEvents().then((stream) => {
    stream.on("data", (chunk: Buffer) => {
      const event = JSON.parse(chunk.toString());

      if (event.Type !== "container") {
        return;
      }

      if (event.Type === "container" && event.Action === "start") {
        console.log(
          `Container: ${event.Actor.Attributes.name} start event. ID: ${event.id}`
        );

        const startedContainer = docker.getContainer(event.id);
        console.log("new container: ", JSON.stringify(startedContainer));
      }
    });
  });
}
