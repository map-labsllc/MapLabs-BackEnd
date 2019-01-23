
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments("user_id").primary()
    table.text('fname').notNullable()
    table.text('lname').notNullable()
    table.text('email').notNullable()
    table.integer('login_service_id').notNullable().defaultTo(0)
    table.text('login_token').notNullable()
    table.integer('curr_module').notNullable().defaultTo(1)
    table.integer('curr_section').notNullable().defaultTo(1)
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))

    table.unique(['login_service_id', 'login_token'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
