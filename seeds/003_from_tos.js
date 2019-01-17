
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('from_tos').del()
    .then(function () {
      // Inserts seed entries
      return knex('from_tos').insert([
        { from_to_id: 1, from_to_code: 1, user_id: 1, from: '1st from for user_id = 1, from_to_code = 1', to: '1st to for user_id = 1, from_to_code = 1' },
        { from_to_id: 2, from_to_code: 1, user_id: 1, from: '2nd from for user_id = 1, from_to_code = 1', to: '2nd to for user_id = 1, from_to_code = 1' },
        { from_to_id: 3, from_to_code: 2, user_id: 1, from: '1st from for user_id = 1, from_to_code = 2', to: '1st to for user_id = 1, from_to_code = 2' },
        { from_to_id: 4, from_to_code: 2, user_id: 1, from: '2nd from for user_id = 1, from_to_code = 2', to: '2nd to for user_id = 1, from_to_code = 2' },
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('from_tos_from_to_id_seq', (SELECT MAX(from_to_id) FROM from_tos))`)
			})
    });
};
