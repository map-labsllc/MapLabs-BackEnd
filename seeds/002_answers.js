exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('answers').del()
    .then(() => {
      // Inserts seed entries
      return knex('answers').insert([
      ])
    .then(() => {
			 // Moves id column (PK) auto-incremented to correct value after inserts
			return knex.raw(`SELECT setval('answers_answer_id_seq', (SELECT MAX(id) FROM answers))`)
		})
  });
};
