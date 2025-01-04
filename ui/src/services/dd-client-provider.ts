import { DockerDesktopClient } from "@docker/extension-api-client-types/dist/v1";
import { createDockerDesktopClient } from "@docker/extension-api-client";

export class DdClientProvider {
    private static _ddClient: DockerDesktopClient;

    public static getClient() : DockerDesktopClient{

        if(!this._ddClient)
        {
            this._ddClient = createDockerDesktopClient();
        }

        return this._ddClient;
    }
}