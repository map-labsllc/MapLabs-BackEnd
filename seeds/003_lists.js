
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('lists').del()
    .then(function () {
      // Inserts seed entries
      return knex('lists').insert([
        {id: 1, name: 'strengths'}
      ]);
    });
};
