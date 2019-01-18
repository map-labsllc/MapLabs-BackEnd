
exports.up = function(knex, Promise) {
  return knex.schema.createTable('transitions', function(table) {
    table.increments("transition_id").primary()
    table.integer('user_id').notNullable()
    table.integer('question_code').notNullable()
    table.text('from').notNullable()
    table.text('to').notNullable()

    table.foreign('user_id').references('users.user_id').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('transitions')
};
