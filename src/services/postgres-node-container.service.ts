// import getPort from "get-port";
// const getPort = require("get-port");
import { getPort } from 'get-port-please'
import {RunningPostgresContainerModel} from "../models/running-postgres-container.model";
import {GenericContainer} from "testcontainers";
import {PortWithOptionalBinding} from "testcontainers/dist/port";

// TODO docs
export class PostgresNodeContainerService {
    // TODO docs
    async setupPostgresContainer(
        username = 'postgres',
        password = 'postgres123',
        databaseName = 'default',
    ): Promise<RunningPostgresContainerModel> {
        const containerPort = await this.getAvailableTCPPort();
        try {
            const portSetup: PortWithOptionalBinding = {
                container: 5432, // postgres port
                host: containerPort
            }
            const container = await new GenericContainer("postgres:latest")
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
            // means port is already in use. use a different port
            if(exception.json.message.includes('driver failed programming external connectivity')) {

            }
            // TODO handle error
            return undefined;
        }
    }

    /**
     * Gets a TCP port that is available on the host machine.
     */
    private async getAvailableTCPPort(): Promise<number> {
        return await getPort();
    }
}