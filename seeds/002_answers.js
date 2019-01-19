
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('answers').del()
    .then(function () {
      // Inserts seed entries
      return knex('answers').insert([
        { answer_id: 1, question_code: 1, user_id: 1, answer: '1st_u1_a1' },
        { answer_id: 2, question_code: 1, user_id: 1, answer: '2nd_u1_a1' },
        { answer_id: 3, question_code: 2, user_id: 1, answer: '1st_u1_a2' },
        { answer_id: 4, question_code: 2, user_id: 1, answer: '2nd_u1_a2' },
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('answers_answer_id_seq', (SELECT MAX(answer_id) FROM answers))`)
			})
    });
};
