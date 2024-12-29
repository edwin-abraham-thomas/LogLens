var Docker = require("dockerode");
const { dockerSocketFile } = require("../constants");
const { processLogs } = require("./process-log-chunks");
const { logsCollectionName } = require("../constants");

async function start(db) {
  console.log("Starting log ingest job");
  var docker = new Docker({ socketPath: dockerSocketFile });

  const containers = await docker.listContainers();
  containers
    .filter(
      (containerInfo) =>
        !["/loglensbackend", "/loglensdb"].includes(containerInfo.Names[0])
    )
    .forEach((containerInfo) => {
      docker.getContainer(containerInfo.Id).logs(
        {
          follow: true,
          details: false,
          timestamps: true,
          stdout: true,
          stderr: true,
        },
        (err, stream) => {
          if (err) {
            console.error("Error getting logs for container", containerInfo.Id);
            return;
          }

          stream.on("data", async (chunk) => {
            let logs = processLogs(chunk);

            logs.forEach((l) =>
              console.log(
                `${l.timestamp.toLocaleString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  fractionalSecondDigits: 3,
                })} ----- ${l.streamType} ---- ${l.log}`
              )
            );
            await db.collection(logsCollectionName).insertMany(logs);
          });
        }
      );
    });

  docker.getEvents().then((stream) => {
    stream.on("data", (chunk) => {
      const event = JSON.parse(chunk.toString());

      if (event.Type !== "container") {
        return;
      }

      if (event.Type === "container" && event.Action === "start") {
        console.log(
          `Container: ${event.Actor.Attributes.name} start event. ID: ${event.id}`
        );
      }
    });
  });
}

module.exports = {
  start,
};
