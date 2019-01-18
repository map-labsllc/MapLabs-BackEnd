
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('transitions').del()
    .then(function () {
      // Inserts seed entries
      return knex('transitions').insert([
        { transition_id: 1, question_code: 4, user_id: 1, from: 'sad', to: 'happy' },
        { transition_id: 2, question_code: 4, user_id: 1, from: 'tall', to: 'short' },
        { transition_id: 3, question_code: 5, user_id: 1, from: 'red', to: 'black' },
        { transition_id: 4, question_code: 5, user_id: 1, from: 'top', to: 'bottom' },
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('transitions_transition_id_seq', (SELECT MAX(transition_id) FROM transitions))`)
			})
    });
};
