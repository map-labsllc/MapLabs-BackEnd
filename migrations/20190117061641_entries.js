
exports.up = function(knex, Promise) {
  return knex.schema.createTable('entries', function(table) {
    table.increments("entry_id").primary()
    table.integer('entry_code').notNullable()
    table.integer('user_id').notNullable()
    table.text('entry').notNullable()

    table.foreign('user_id').references('users.user_id').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('entries')
};
