# PostgreSQL Setup and Migrations

The API uses PostgreSQL through TypeORM. Schema changes are applied by the
checked-in Sequelize CLI migrations before the backend starts; TypeORM schema
synchronization is disabled.

## Start the Docker stack

1. Copy the root `.env.example` to `.env`.
2. Replace the sample `DB_PASSWORD`, `ACCESS_TOKEN_SECRET`, and
   `ADMIN_PASSWORD` values with local secrets. `ADMIN_PASSWORD` must contain at
   least 12 characters.
3. Run from the repository root:

   ```sh
   docker compose up --build
   ```

Compose starts PostgreSQL and Redis, waits for their health checks, then builds
the backend. The backend builds its TypeScript, applies pending migrations, and
starts the API. PostgreSQL data is kept in the `postgres_data` named volume.

`DB_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ACCESS_TOKEN_SECRET` are
required by Compose. Do not use the example secrets outside local development.

## Run migrations manually

When running the backend outside Compose, set `DB_HOST`, `DB_PORT`, `DB_NAME`,
`DB_USER`, and `DB_PASSWORD`, along with `ADMIN_EMAIL` and `ADMIN_PASSWORD` for
the initial admin seed. From the backend directory, run:

```sh
npm run migrate
```

Migrations are tracked in Sequelize's `SequelizeMeta` table and are safe to run
again; only pending migrations are applied. Back up the database before
deploying schema changes. Do not enable TypeORM `synchronize` in production.
