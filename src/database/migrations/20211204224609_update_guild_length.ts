import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('guilds', table => {
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('guilds', table => {
    table.dropColumn('created_at')
    table.dropColumn('updated_at')
  })
}

