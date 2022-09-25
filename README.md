# Postgres node container
Setup a postgres container from NodeJS. Ideal for testing or a throwaway database. 

Installation
```bash
npm install --save postgres-node-container
```

# Usage
Example usage of setting up a postgres container from NodeJS
```js
// setup a postgres container with random port and default credentials
const postgresContainer = await postgresContainerService.setupPostgresContainer();
const client = new Client({
    user: postgresContainer.postgresUsername,
    host: postgresContainer.postgresHost,
    database: postgresContainer.postgresDatabase,
    password: postgresContainer.postgresPassword,
    port: postgresContainer.postgresPort,
});
await postgresContainer.stop();
```

Or set custom database with custom settings and credentials
```bash
const username = 'johnDoe';
const password = 'superSecret';
const database = 'superSecret';
const databaseVersion = '11-alpine';

const postgresContainer = await postgresContainerService.setupPostgresContainer(username, password, database, databaseVersion);
const client = new Client({
    user: postgresContainer.postgresUsername,
    host: postgresContainer.postgresHost,
    database: postgresContainer.postgresDatabase,
    password: postgresContainer.postgresPassword,
    port: postgresContainer.postgresPort,
});

// setup a postgres container with random port and default credentials
await postgresContainer.stop();
```

You can also get generate connection string from the container
```js
const postgresContainer = await postgresContainerService.setupPostgresContainer();
const connectionString = postgresContainer.getPostgresConnectionString();

// connection string for example postgres://postgres:postgres@localhost:32768/postgres
```
# Development
Install dependencies

```bash
npm install
```

Run tests
```bash
npm run test
```

# Project roadmap
- [x] Start postgres container
- [x] Stop container
- [x] Get connection details
- [x] Select postgres version
- [x] Add tests
- [x] Add examples
- [x] Add documentation
- [ ] Fix package installation and usage with examples