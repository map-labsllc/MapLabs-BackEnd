exports.up = function(knex, Promise) {
  return knex.schema.table('answers', function(table) {
    table.renameColumn('answer_id', 'id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('answers', function(table) {
    table.renameColumn('id', 'answer_id')
  })
};
