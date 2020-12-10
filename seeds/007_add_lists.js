
exports.seed = function(knex) {
  return knex('lists').insert([
    {id: 4, name: 'social_influences'},
    {id: 5, name: 'wider_influences'},
  ])
};
