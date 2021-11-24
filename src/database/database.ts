import knex from 'knex';
import knexFile from './knexfile';

const database = knex(knexFile);

database.raw("SELECT 1").then(() => {
    console.log("PostgreSQL connected");
})
.catch((e) => {
    console.log("PostgreSQL not connected");
    console.error(e);
});

export default database;