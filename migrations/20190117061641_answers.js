
exports.up = function(knex, Promise) {
  return knex.schema.createTable('answers', function(table) {
    table.increments("answer_id").primary()
    table.integer('user_id').notNullable()
    table.integer('question_code').notNullable()
    table.integer('question_type').notNullable()
    table.text('field1').notNullable().defaultTo("")
    table.text('field2').notNullable().defaultTo("")
    table.text('field3').notNullable().defaultTo("")
    table.text('field4').notNullable().defaultTo("")
    table.text('field5').notNullable().defaultTo("")
    table.text('field6').notNullable().defaultTo("")

    table.foreign('user_id').references('users.user_id').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('answers')
};
