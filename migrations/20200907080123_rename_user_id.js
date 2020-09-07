exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.renameColumn('user_id', 'id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.renameColumn('id', 'user_id')
  })
};
