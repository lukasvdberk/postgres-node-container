import {StartedTestContainer} from "testcontainers";

export class RunningPostgresContainerModel {
    constructor(
        private readonly container: StartedTestContainer
    ) {}

    /**
     * Stops the container and removes it.
     */
    async stop() {
        // TODO actual implementation
        await this.container.stop()
    }
}