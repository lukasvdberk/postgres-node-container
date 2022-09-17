import {RunningPostgresContainerModel} from "../models/running-postgres-container.model";
import {GenericContainer} from "testcontainers";

// TODO docs
export class PostgresNodeContainerService {
    // TODO docs
    async setupPostgresContainer(): Promise<RunningPostgresContainerModel> {
        const container = await new GenericContainer("postgres:latest")
            .withExposedPorts(6379)
            .start();
        return new RunningPostgresContainerModel(container);
    }
}