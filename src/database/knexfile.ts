import env from "../env";
import { Knex } from "knex";

const config: Knex.Config = {
    client: 'postgresql',
    connection: {
      database: env.DB_NAME,
      user:     env.DB_USER,
      password: env.DB_PASSWORD
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