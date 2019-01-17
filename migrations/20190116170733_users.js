
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments("user_id").primary()
    table.string('fname', 255).notNullable()
    table.string('lname', 255).notNullable()
    table.string('email', 255).notNullable()
    table.unique('email')
    table.integer('login_service').notNullable().defaultTo(0)
    table.text('token').notNullable()
    table.integer('mod_complete').notNullable().defaultTo(0)
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
