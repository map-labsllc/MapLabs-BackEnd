
exports.up = function(knex, Promise) {
  return knex.schema.createTable('from_tos', function(table) {
    table.increments("from_to_id").primary()
    table.integer('question_code').notNullable()
    table.integer('user_id').notNullable()
    table.text('from').notNullable()
    table.text('to').notNullable()

    table.foreign('user_id').references('users.user_id').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('from_tos')
};
