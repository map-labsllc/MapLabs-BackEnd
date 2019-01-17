
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('entries').del()
    .then(function () {
      // Inserts seed entries
      return knex('entries').insert([
        { entry_id: 1, entry_code: 1, user_id: 1, entry: '1st for user_id = 1, entry_code = 1' },
        { entry_id: 2, entry_code: 1, user_id: 1, entry: '2nd for user_id = 1, entry_code = 1' },
        { entry_id: 3, entry_code: 2, user_id: 1, entry: '1st for user_id = 1, entry_code = 2' },
        { entry_id: 4, entry_code: 2, user_id: 1, entry: '2nd for user_id = 1, entry_code = 2' },
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('entries_entry_id_seq', (SELECT MAX(entry_id) FROM entries))`)
			})
    });
};
