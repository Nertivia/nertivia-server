import env from "../env";
import { Knex } from "knex";

const config: Knex.Config = {
    client: 'postgresql',
    connection: {
      database: env.POSTGRES_DB,
      user:     env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      host : env.POSTGRES_HOST,
      port : env.POSTGRES_PORT
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