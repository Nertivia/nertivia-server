import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', table => {
    table.string('discriminator', 4)
    table.integer('password_version')
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('discriminator')
    table.dropColumn('password_version')
  })
}

