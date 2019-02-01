
exports.up = function(knex, Promise) {
    return knex.schema.createTable('influences', function(table) {
        table.increments("influence_id").primary()
        table.integer('user_id').notNullable()
        table.integer('question_code').notNullable()
        table.text('name').notNullable()
        table.text('belief').notNullable()
        table.text('category').notNullable()
    
        table.foreign('user_id').references('users.user_id').onDelete('cascade')
      })
  
};

exports.down = function(knex, Promise) {
  
};
