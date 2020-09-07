exports.up = function(knex, Promise) {
  return knex.schema.table('answers', function(table) {
    table.index('user_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('answers', function(table) {
    table.dropIndex('user_id')
  })
};
