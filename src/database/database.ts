import knex from 'knex';
import knexFile from './knexfile';

const database = knex(knexFile);

export default database;