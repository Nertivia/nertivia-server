import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('friends', table => {
    table.string('requester_id').references('users.id')
    table.string('recipient_id').references('users.id')
    table.integer('status').comment('incoming | outgoing | friends | blocked')
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('friends')
}

