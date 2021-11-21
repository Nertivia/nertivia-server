import env from "../env";
import { Knex } from "knex";

const config: Knex.Config = {
    client: 'postgresql',
    connection: {
      database: env.POSTGRES_NAME,
      user:     env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "migrations",
    }
};

export default config;