exports.up = function(knex, Promise) {
  return knex.schema.createTable('lists', function(table) {
    table.increments("id").primary()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.text('name').notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('lists')
};
