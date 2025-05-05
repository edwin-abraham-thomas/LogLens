import Dockerode from "dockerode";
import { LogsRepository } from "../../data-access/database";
import { Docker } from "../../dependencies/docker";

export class LogPurgeJob {
  private readonly _dockerClient: Dockerode;
  private readonly _logsRepo: LogsRepository;

  /**
   *
   */
  constructor() {
    this._dockerClient = Docker.getDockerClient();
    this._logsRepo = new LogsRepository();
  }

  public async start(): Promise<void> {
    await this.purgeDanglingLogs();
    setInterval(async () => {
      await this.purgeDanglingLogs();
    }, 300000);
  }

  private async purgeDanglingLogs() {
    console.log("log purge job run begin");

    const containers = await this._dockerClient.listContainers({
      all: true
    });
    const containerIds = containers.map((c) => c.Id);

    const danglingLogs = await this._logsRepo.getLogsForNonRunningContainers(
      containerIds
    );
    console.log(`Found ${danglingLogs.length} dangling logs`);

    if (danglingLogs.length > 0) {
      const danglingContainerIds = [
        ...new Set(danglingLogs.map((log) => log.containerId)),
      ];
        const deletedCount = await this._logsRepo.deleteLogsForContainers(
          danglingContainerIds
        );
        console.log(`Deleted ${deletedCount} dangling logs`);
    }

    console.log("log purge job run end");
  }
}
