
exports.up = function(knex, Promise) {
  return knex.schema.createTable('scratches', function(table) {
    table.increments("scratch_id").primary()
    table.integer('scratch_code').notNullable()
    table.integer('user_id').notNullable()
    table.text('scratch').notNullable()

    table.foreign('user_id').references('users.user_id').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('entries')
};
