// import getPort from "get-port";
// const getPort = require("get-port");
import { getPort } from 'get-port-please'
import {RunningPostgresContainerModel} from "../models/running-postgres-container.model";
import {GenericContainer} from "testcontainers";
import {PortWithOptionalBinding} from "testcontainers/dist/port";
import {CouldNotCreateContainerError} from "../errors/could-not-create-container.error";

// TODO docs
export class PostgresNodeContainerService {
    // TODO docs
    async setupPostgresContainer(
        username = 'postgres',
        password = 'postgres123',
        databaseName = 'default',
        postgresContainerTag = 'latest',
    ): Promise<RunningPostgresContainerModel> {
        const containerPort = await this.getAvailableTCPPort();
        try {
            const portSetup: PortWithOptionalBinding = {
                container: 5432, // postgres port
                host: containerPort
            }
            const container = await new GenericContainer(`postgres:${postgresContainerTag}`)
                .withEnv("POSTGRES_USER", username)
                .withEnv("POSTGRES_PASSWORD", password)
                .withEnv("POSTGRES_DB", databaseName) // database name to setup
                .withExposedPorts(portSetup)
                .start();
            return new RunningPostgresContainerModel(
                container,
                await container.getHost(),
                username,
                password,
                containerPort,
                databaseName
            );
        } catch (exception) {
            throw new CouldNotCreateContainerError(exception.message);
        }
    }

    /**
     * Gets a TCP port that is available on the host machine.
     */
    private async getAvailableTCPPort(): Promise<number> {
        return await getPort();
    }
}