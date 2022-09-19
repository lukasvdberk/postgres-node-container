import {StartedTestContainer} from "testcontainers";

export class RunningPostgresContainerModel {
    private readonly container: StartedTestContainer
    postgresHost: string
    postgresUsername: string
    postgresPassword: string
    postgresPort: number
    postgresDatabase: string


    constructor(container: StartedTestContainer, postgresHost: string, postgresUsername: string, postgresPassword: string, postgresPort: number, postgresDatabase: string) {
        this.container = container;
        this.postgresHost = postgresHost;
        this.postgresUsername = postgresUsername;
        this.postgresPassword = postgresPassword;
        this.postgresPort = postgresPort;
        this.postgresDatabase = postgresDatabase;
    }

    /**
     * Postgres' connection string you can use to connect to the container.
     */
    getPostgresConnectionString(): string {
        return `postgresql://${this.postgresUsername}:${this.postgresPassword}@${this.postgresHost}:${this.postgresPort}/${this.postgresDatabase}`
    }

    /**
     * Stops the container and removes it.
     */
    async stop() {
        await this.container.stop()
    }
}