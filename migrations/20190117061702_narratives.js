exports.up = function(knex, Promise) {
  return knex.schema.createTable('narratives', function(table) {
    table.increments("narrative_id").primary()
    table.integer('narrative_code').notNullable()
    table.integer('user_id').notNullable()
    table.unique(['narrative_code', 'user_id'])
    table.text('narrative').notNullable()

    table.foreign('user_id').references('users.user_id').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('narratives')
};
