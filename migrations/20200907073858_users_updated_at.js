
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}