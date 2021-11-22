import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("guilds", (table) => {
    table.string("id").primary()
    table.string("creator_id").references("users.id")
    table.string("name")
    table.string("icon")
    table.integer("verified")
    table.integer("member_limit")
    table.integer("rate_limit")
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("guilds");
}

