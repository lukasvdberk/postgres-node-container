import {describe, expect, it} from '@jest/globals';
import {PostgresNodeContainerService} from "../src/services/postgres-node-container.service";
import {Client} from "pg";


describe('setup postgres container', () => {
    let postgresContainerService = new PostgresNodeContainerService();

    async function assertWorkingPostgresDatabase(client: Client): Promise<void> {
        await client.connect()
        const res = await client.query('SELECT $1::text as message', ['Hello world!'])
        expect(res.rows[0].message).toBe('Hello world!') // can successfully connect to the postgres container

        // create table
        await client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(100))')

        // insert
        await client.query('INSERT INTO users(name) VALUES($1)', ['John Doe'])

        // select previously entered record
        const users = await client.query('SELECT * FROM users');
        expect(users.rows[0].name).toBe('John Doe') // can successfully create a table and insert a record

        await client.end()
    }

    it('should setup a postgres container', async () => {
        const postgresContainer = await postgresContainerService.setupPostgresContainer();
        const client = new Client({
            user: postgresContainer.postgresUsername,
            host: postgresContainer.postgresHost,
            database: postgresContainer.postgresDatabase,
            password: postgresContainer.postgresPassword,
            port: postgresContainer.postgresPort,
        })

        await assertWorkingPostgresDatabase(client)
        await postgresContainer.stop();
    });

    it('should setup a postgres container with custom port, username and password', async () => {
        const username = 'johnDoe';
        const password = 'superSecret';
        const database = 'superSecret';

        const postgresContainer = await postgresContainerService.setupPostgresContainer(username, password, database);
        const client = new Client({
            user: username,
            host: postgresContainer.postgresHost,
            database: database,
            password: password,
            port: postgresContainer.postgresPort,
        })
        await assertWorkingPostgresDatabase(client)
        await postgresContainer.stop();
    });

    it('should generate a correct connection URL ', async () => {
        const postgresContainer = await postgresContainerService.setupPostgresContainer();

        // generate URL from the connection options
        const client = new Client(postgresContainer.getPostgresConnectionString())
        await assertWorkingPostgresDatabase(client)
        await postgresContainer.stop();
    });

    it('should setup a second container with a different port', async () => {
        const postgresContainer = await postgresContainerService.setupPostgresContainer();
        const connectionString = postgresContainer.getPostgresConnectionString()
        const client = new Client(connectionString)

        await assertWorkingPostgresDatabase(client)

        const postgresContainer2 = await postgresContainerService.setupPostgresContainer();
        const client2 = new Client(postgresContainer2.getPostgresConnectionString())


        // each should be given a unique port
        expect(postgresContainer2.postgresPort).not.toBe(postgresContainer.postgresPort) // different port
        await assertWorkingPostgresDatabase(client2)
        await postgresContainer.stop();
    });
});