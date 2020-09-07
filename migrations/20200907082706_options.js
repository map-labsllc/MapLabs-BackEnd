
exports.up = function(knex, Promise) {
  return knex.schema.createTable('options', function(table) {
    table.increments("id").primary()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.integer('list_id').notNullable()
    table.text('value').notNullable().defaultTo("")

    table.foreign('list_id').references('lists.id').onDelete('cascade')
    table.index('list_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('options')
};
