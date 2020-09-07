
exports.up = function(knex) {
  return knex.schema.table('options', function(table) {
    table.integer('sort')
  })
};

exports.down = function(knex) {
  return knex.schema.table('options', function(table) {
    table.dropColumn('sort')
  })
};
