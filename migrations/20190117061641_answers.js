
exports.up = function(knex, Promise) {
  return knex.schema.createTable('answers', function(table) {
    table.increments("answer_id").primary()
    table.integer('user_id').notNullable()
    table.integer('question_code').notNullable()
    table.text('answer').notNullable()

    table.foreign('user_id').references('users.user_id').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('answers')
};
